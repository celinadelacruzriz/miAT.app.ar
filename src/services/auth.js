import { supabase } from "../lib/supabase"

export async function loginWithEmail(email) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:5173/auth/callback",
    },
  })
}

export async function logout() {
  await supabase.auth.signOut()
}


