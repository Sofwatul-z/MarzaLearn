import { supabase } from "./supabase";

const RESET_OVERRIDES_KEY = "marzalearn-reset-overrides";

// Deprecated local override mechanism: we clear any legacy local override
// so devices (like Device A) never get stuck displaying 0% instead of real database values.
export function getResetOverrides() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
    } catch (e) {}
  }
  return {};
}

export function setResetOverride() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
    } catch (e) {}
  }
}

export function setAllResetOverrides() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
    } catch (e) {}
  }
}

export function clearResetOverride() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
    } catch (e) {}
  }
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

  // Pure cloud source of truth - no artificial local overrides
  return rawData || [];
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
    Math.max(1, numChapterId - 15),
  ]));

  let rpcSucceeded = false;

  // 1. Primary: transactional RPC teacher_reset_student_chapter in Supabase
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "teacher_reset_student_chapter",
      {
        target_student_id: studentId,
        target_chapter_id: numChapterId,
      }
    );

    if (!rpcError && (rpcData?.success || rpcData === true)) {
      rpcSucceeded = true;
    } else if (rpcError) {
      // Try alternative parameter naming
      const { data: rpcData2, error: rpcError2 } = await supabase.rpc(
        "teacher_reset_student_chapter",
        {
          student_id: studentId,
          chapter_id: numChapterId,
        }
      );
      if (!rpcError2 && (rpcData2?.success || rpcData2 === true)) {
        rpcSucceeded = true;
      }
    }
  } catch (err) {
    console.warn("RPC teacher_reset_student_chapter error:", err);
  }

  // 1b. Fallback to reset_student_chapter RPC if teacher_reset_student_chapter not found
  if (!rpcSucceeded) {
    try {
      const { data: altData, error: altError } = await supabase.rpc(
        "reset_student_chapter",
        {
          p_identifier: studentId,
          p_chapter_id: numChapterId,
        }
      );
      if (!altError && (altData?.success || altData === true)) {
        rpcSucceeded = true;
      }
    } catch (e) {}
  }

  // 2. Direct database cleanup (always execute to guarantee cloud cleanliness)
  try {
    // Delete or zero out student_progress
    await supabase
      .from("student_progress")
      .delete()
      .eq("student_id", studentId)
      .in("chapter_id", targetChapterIds);

    // Also delete learning_sessions so old answers (like draft sentences) are completely wiped from cloud
    await supabase
      .from("learning_sessions")
      .delete()
      .eq("student_id", studentId)
      .in("chapter_id", targetChapterIds);

    // Clear project submissions
    await supabase
      .from("project_submissions")
      .delete()
      .eq("student_id", studentId)
      .in("chapter_id", targetChapterIds);
  } catch (err) {
    console.warn("Direct database reset warning:", err);
  }

  // 4. Remove local browser artifacts & ensure overrides are completely deleted
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
      window.localStorage.removeItem(`marzalearn-session-v1:${studentId}:${numChapterId}`);
      window.localStorage.removeItem(`marzalearn-session:${studentId}:${numChapterId}`);
      window.localStorage.removeItem(`marzalearn-project:${studentId}:${numChapterId}`);

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
    } catch (e) {
      console.warn("Local storage cleanup warning:", e);
    }
  }

  return { ok: true, rpc: rpcSucceeded };
}

export async function resetAllStudentProgress(studentId) {
  if (!studentId) {
    return { ok: false, error: new Error("Missing studentId") };
  }

  try {
    for (let cId = 1; cId <= 5; cId++) {
      await resetStudentChapterProgress(studentId, cId);
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(RESET_OVERRIDES_KEY);
      window.localStorage.removeItem(`marzalearn-reset-timestamp:${studentId}:all`);

      const gradesKey = "marzalearn-mission-grades";
      const storedGrades = JSON.parse(window.localStorage.getItem(gradesKey) || "{}");
      Object.keys(storedGrades).forEach((k) => {
        if (k.startsWith(`${studentId}-`)) delete storedGrades[k];
      });
      window.localStorage.setItem(gradesKey, JSON.stringify(storedGrades));

      window.dispatchEvent(
        new CustomEvent("marzalearn:session-reset", {
          detail: { studentId, all: true },
        })
      );

      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("marzalearn_sync");
        bc.postMessage({
          type: "SESSION_RESET_ALL",
          studentId,
          timestamp: Date.now(),
        });
        bc.close();
      }
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to reset all student progress:", err);
    return { ok: false, error: err };
  }
}
