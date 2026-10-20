import { supabase } from "./supabase";

const RESET_OVERRIDES_KEY = "marzalearn-reset-overrides";

export function getResetOverrides() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(RESET_OVERRIDES_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function setResetOverride(studentId, chapterId) {
  if (typeof window === "undefined" || !studentId) return;
  try {
    const overrides = getResetOverrides();
    overrides[studentId] = overrides[studentId] || {};
    const num = Number(chapterId);
    overrides[studentId][num] = true;
    overrides[studentId][num + 15] = true;
    window.localStorage.setItem(RESET_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {}
}

export function setAllResetOverrides(studentId) {
  if (typeof window === "undefined" || !studentId) return;
  try {
    const overrides = getResetOverrides();
    overrides[studentId] = overrides[studentId] || {};
    for (let c = 1; c <= 5; c++) {
      overrides[studentId][c] = true;
      overrides[studentId][c + 15] = true;
    }
    overrides[studentId]["all"] = true;
    window.localStorage.setItem(RESET_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {}
}

export function clearResetOverride(studentId, chapterId) {
  if (typeof window === "undefined" || !studentId) return;
  try {
    const overrides = getResetOverrides();
    if (overrides[studentId]) {
      const num = Number(chapterId);
      delete overrides[studentId][num];
      delete overrides[studentId][num + 15];
      delete overrides[studentId]["all"];
      window.localStorage.setItem(RESET_OVERRIDES_KEY, JSON.stringify(overrides));
    }
  } catch (e) {}
}

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

  let rawData = [];
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_student_progress",
      { target_student: studentId }
    );
    if (!rpcError && rpcData) rawData = rpcData;
  } catch (e) {}

  if (!rawData || rawData.length === 0) {
    const { data, error } = await supabase
      .from("student_progress")
      .select("*")
      .eq("student_id", studentId)
      .order("chapter_id", { ascending: true });

    if (error) {
      console.warn("Could not load student progress:", error);
    } else {
      rawData = data || [];
    }
  }

  // Ensure reset overrides are always applied
  const overrides = getResetOverrides();
  const studentOverrides = overrides[studentId] || {};
  const isAllReset = Boolean(studentOverrides["all"]);

  return (rawData || []).map((r) => {
    const cId = Number(r.chapter_id);
    const isReset =
      isAllReset ||
      Boolean(studentOverrides[cId]) ||
      Boolean(studentOverrides[cId - 15]) ||
      Boolean(studentOverrides[cId + 15]);

    if (isReset) {
      return {
        ...r,
        percentage: 0,
        provide: false,
        restate: false,
        visualize: false,
        engage: false,
        discuss: false,
        play: false,
        status: "not_started",
      };
    }
    return r;
  });
}

export async function getStudentsWithProgress(className) {
  const students = await getStudentsByClass(className);
  if (!students || students.length === 0) return [];

  const studentIds = students.map((s) => s.id);
  const { data: progressData } = await supabase
    .from("student_progress")
    .select("*")
    .in("student_id", studentIds);

  const overrides = getResetOverrides();

  const byStudent = (progressData || []).reduce((acc, row) => {
    acc[row.student_id] = acc[row.student_id] || [];
    acc[row.student_id].push(row);
    return acc;
  }, {});

  return students.map((student) => {
    let rawRows = byStudent[student.id] || [];
    const studentOverrides = overrides[student.id] || {};
    const isAllReset = Boolean(studentOverrides["all"]);

    const rows = rawRows.map((r) => {
      const cId = Number(r.chapter_id);
      const isReset =
        isAllReset ||
        Boolean(studentOverrides[cId]) ||
        Boolean(studentOverrides[cId - 15]) ||
        Boolean(studentOverrides[cId + 15]);

      if (isReset) {
        return {
          ...r,
          percentage: 0,
          provide: false,
          restate: false,
          visualize: false,
          engage: false,
          discuss: false,
          play: false,
        };
      }
      return r;
    });

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

  // Record in reset overrides map immediately
  setResetOverride(studentId, numChapterId);

  try {
    // 1. Delete and Update student_progress in Supabase
    try {
      await supabase
        .from("student_progress")
        .delete()
        .eq("student_id", studentId)
        .in("chapter_id", targetChapterIds);
    } catch (e) {}

    try {
      await supabase
        .from("student_progress")
        .update({
          provide: false,
          restate: false,
          visualize: false,
          engage: false,
          discuss: false,
          play: false,
          percentage: 0,
        })
        .eq("student_id", studentId)
        .in("chapter_id", targetChapterIds);
    } catch (e) {}

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

      try {
        await supabase
          .from("student_progress")
          .upsert(progressPayload, { onConflict: "student_id,chapter_id" });
      } catch (e) {
        console.warn("student_progress reset warning:", e);
      }
    }

    // 2. Delete from student_step_progress if present
    try {
      await supabase
        .from("student_step_progress")
        .delete()
        .eq("student_id", studentId)
        .in("chapter_id", targetChapterIds);
    } catch (e) {}

    // 3. Delete from project_submissions in Supabase
    try {
      await supabase
        .from("project_submissions")
        .delete()
        .eq("student_id", studentId)
        .in("chapter_id", targetChapterIds);
    } catch (e) {}

    // 4. Try updating learning_sessions if the table exists
    for (const cId of targetChapterIds) {
      try {
        await supabase
          .from("learning_sessions")
          .upsert({
            student_id: studentId,
            chapter_id: cId,
            status: "reset",
            current_step: 1,
            session_data: { reset: true, resetAt: new Date().toISOString() },
            started_at: null,
            completed_at: null,
            updated_at: new Date().toISOString(),
          }, { onConflict: "student_id,chapter_id" });
      } catch (e) {}
    }

    // 5. Clean local storage for this student and chapter
    if (typeof window !== "undefined") {
      try {
        const prefix = `marzalearn-session-v1:${studentId}:${numChapterId}`;
        window.localStorage.removeItem(prefix);
        window.localStorage.removeItem(`marzalearn-project:${studentId}:${numChapterId}`);

        // Set reset timestamp marker so student client respects this reset
        window.localStorage.setItem(
          `marzalearn-reset-timestamp:${studentId}:${numChapterId}`,
          new Date().toISOString()
        );

        const allKey = "marzalearn-all-projects";
        const existing = JSON.parse(window.localStorage.getItem(allKey) || "[]");
        const filtered = existing.filter(
          (p) => !(p.student_id === studentId && targetChapterIds.includes(Number(p.chapter_id)))
        );
        window.localStorage.setItem(allKey, JSON.stringify(filtered));

        // Clear stored mission grades for this student & chapter
        const gradesKey = "marzalearn-mission-grades";
        const storedGrades = JSON.parse(window.localStorage.getItem(gradesKey) || "{}");
        targetChapterIds.forEach((c) => {
          delete storedGrades[`${studentId}-${c}`];
        });
        window.localStorage.setItem(gradesKey, JSON.stringify(storedGrades));

        // Dispatch sync event for active student tabs in same window
        window.dispatchEvent(
          new CustomEvent("marzalearn:session-reset", {
            detail: { studentId, chapterId: numChapterId },
          })
        );

        // Broadcast to all other open tabs/windows
        try {
          if (typeof BroadcastChannel !== "undefined") {
            const bc = new BroadcastChannel("marzalearn_sync");
            bc.postMessage({
              type: "SESSION_RESET",
              studentId,
              chapterId: numChapterId,
              timestamp: Date.now(),
            });
            bc.close();
          }
        } catch (e) {}
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
  setAllResetOverrides(studentId);
  if (!studentId) {
    return { ok: false, error: new Error("Missing studentId") };
  }

  try {
    for (let cId = 1; cId <= 5; cId++) {
      await resetStudentChapterProgress(studentId, cId);
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `marzalearn-reset-timestamp:${studentId}:all`,
        new Date().toISOString()
      );

      const gradesKey = "marzalearn-mission-grades";
      const storedGrades = JSON.parse(window.localStorage.getItem(gradesKey) || "{}");
      Object.keys(storedGrades).forEach((k) => {
        if (k.startsWith(`${studentId}-`)) delete storedGrades[k];
      });
      window.localStorage.setItem(gradesKey, JSON.stringify(storedGrades));
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("marzalearn_sync");
          bc.postMessage({
            type: "SESSION_RESET_ALL",
            studentId,
            timestamp: Date.now(),
          });
          bc.close();
        }
      } catch (e) {}
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to reset all student progress:", err);
    return { ok: false, error: err };
  }
}
