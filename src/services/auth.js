// src/services/auth.js
import { supabase } from "../lib/supabase";

export async function loginWithEmail(email) {
  if (!email) {
    throw new Error("Email requerido");
  }

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function logout() {
  await supabase.auth.signOut();
}