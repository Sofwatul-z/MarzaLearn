import { supabase } from "./supabase";

export async function getStudentsByClass(className) {
  try {
    const { data, error } = await supabase.rpc("get_students_by_class", {
      target_class: className,
    });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn("RPC get_students_by_class error, querying profiles table:", err);
  }

  // Fallback: query profiles directly from Supabase
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .ilike("class_name", className);

  if (profileError) {
    console.error("Failed to query student profiles:", profileError);
    return [];
  }

  return profileData || [];
}

export async function getStudentProgress(studentId) {
  if (!studentId) return [];

  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_student_progress",
      { target_student: studentId }
    );
    if (!rpcError && rpcData) return rpcData;
  } catch (e) {}

  const { data, error } = await supabase
    .from("student_progress")
    .select("*")
    .eq("student_id", studentId)
    .order("chapter_id", { ascending: true });

  if (error) {
    console.warn("Could not load student progress:", error);
    return [];
  }

  return data || [];
}

export async function getStudentsWithProgress(className) {
  const students = await getStudentsByClass(className);
  if (!students || students.length === 0) return [];

  const studentIds = students.map((s) => s.id);
  const { data: progressData } = await supabase
    .from("student_progress")
    .select("*")
    .in("student_id", studentIds);

  const byStudent = (progressData || []).reduce((acc, row) => {
    acc[row.student_id] = acc[row.student_id] || [];
    acc[row.student_id].push(row);
    return acc;
  }, {});

  return students.map((student) => {
    const rows = byStudent[student.id] || [];
    const completedChapters = rows.filter((r) => Number(r.percentage) >= 100).length;
    const avgScore = rows.length
      ? Math.round(
          rows.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0) /
            rows.length
        )
      : 0;

    const activities = rows.reduce((sum, r) => {
      let count = 0;
      if (r.provide) count += 1;
      if (r.restate) count += 1;
      if (r.visualize) count += 1;
      if (r.engage) count += 1;
      if (r.discuss) count += 1;
      if (r.play) count += 1;
      return sum + count;
    }, 0);

    return {
      ...student,
      progress: {
        completed_chapters: completedChapters,
        average_score: avgScore,
        activities,
        rows,
      },
    };
  });
}

export async function resetStudentChapterProgress(studentId, chapterId) {
  if (!studentId || !chapterId) {
    return { ok: false, error: new Error("Missing studentId or chapterId") };
  }

  const numChapterId = Number(chapterId);
  const targetChapterIds = Array.from(new Set([
    numChapterId,
    numChapterId + 15,
    Math.max(1, numChapterId - 15)
  ]));

  try {
    // 1. Reset status='reset' in learning_sessions so student clients wipe local cache
    for (const cId of targetChapterIds) {
      const resetPayload = {
        student_id: studentId,
        chapter_id: cId,
        status: "reset",
        current_step: 1,
        session_data: { reset: true, resetAt: new Date().toISOString() },
        started_at: null,
        completed_at: null,
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from("learning_sessions")
        .upsert(resetPayload, { onConflict: "student_id,chapter_id" });
    }

    // 2. Reset student_progress table in Supabase to 0% and all false
    for (const cId of targetChapterIds) {
      const progressPayload = {
        student_id: studentId,
        chapter_id: cId,
        provide: false,
        restate: false,
        visualize: false,
        engage: false,
        discuss: false,
        play: false,
        percentage: 0,
      };

      await supabase
        .from("student_progress")
        .upsert(progressPayload, { onConflict: "student_id,chapter_id" });
    }

    // 3. Delete from project_submissions in Supabase
    await supabase
      .from("project_submissions")
      .delete()
      .eq("student_id", studentId)
      .in("chapter_id", targetChapterIds);

    // 4. Clean local storage for this student and chapter if on the same browser
    if (typeof window !== "undefined") {
      try {
        const prefix = `marzalearn-session-v1:${studentId}:${numChapterId}`;
        window.localStorage.removeItem(prefix);
        window.localStorage.removeItem(`marzalearn-project:${studentId}:${numChapterId}`);

        const allKey = "marzalearn-all-projects";
        const existing = JSON.parse(window.localStorage.getItem(allKey) || "[]");
        const filtered = existing.filter(
          (p) => !(p.student_id === studentId && targetChapterIds.includes(Number(p.chapter_id)))
        );
        window.localStorage.setItem(allKey, JSON.stringify(filtered));

        // Dispatch sync event for active student tabs
        window.dispatchEvent(
          new CustomEvent("marzalearn:session-reset", {
            detail: { studentId, chapterId: numChapterId },
          })
        );
      } catch (e) {
        console.warn("Local storage cleanup warning:", e);
      }
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to reset student chapter progress:", err);
    return { ok: false, error: err };
  }
}

export async function resetAllStudentProgress(studentId) {
  if (!studentId) {
    return { ok: false, error: new Error("Missing studentId") };
  }

  try {
    for (let cId = 1; cId <= 5; cId++) {
      await resetStudentChapterProgress(studentId, cId);
    }
    return { ok: true };
  } catch (err) {
    console.error("Failed to reset all student progress:", err);
    return { ok: false, error: err };
  }
}
