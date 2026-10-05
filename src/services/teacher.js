import { supabase } from './supabase';

export async function getStudentsByClass(className) {
  const { data, error } = await supabase.rpc(
    'get_students_by_class',
    {
      target_class: className
    }
  );

  if (error) throw error;

  return data || [];
}

export async function getStudentProgress(studentId) {
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_student_progress",
    { target_student: studentId }
  );

  if (!rpcError) return rpcData || [];

  const { data, error } = await supabase
    .from("student_progress")
    .select("*")
    .eq("student_id", studentId)
    .order("chapter_id", { ascending: true });

  if (error) throw rpcError ?? error;
  return data || [];
}
