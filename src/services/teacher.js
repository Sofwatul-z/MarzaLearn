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
