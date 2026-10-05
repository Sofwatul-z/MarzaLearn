import { supabase } from "./supabase";

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    const authError = new Error(error.message || "Supabase login failed");
    authError.code = error.code || "AUTH_LOGIN_FAILED";
    authError.cause = error;
    throw authError;
  }

  let profile;
  try {
    profile = await getUserProfile(data.user.id);
  } catch (profileError) {
    // Authentication succeeded, but the application profile is missing or
    // blocked by RLS. Do not report this as an incorrect password.
    const errorWithContext = new Error("AUTHENTICATED_PROFILE_UNAVAILABLE");
    errorWithContext.code = "PROFILE_UNAVAILABLE";
    errorWithContext.cause = profileError;
    throw errorWithContext;
  }

  return {
    user: data.user,
    profile,
  };
}

export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}
