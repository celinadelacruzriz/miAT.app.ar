import { supabase } from "../lib/supabase"

export async function updateUserRole(userId, role) {
  return supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
}
