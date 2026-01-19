import { supabase } from "../lib/supabase"

/**
 * Trae matches según el post activo del usuario
 */
export async function getMatches(myPost) {
  if (!myPost) return { data: [], error: null }

  const oppositeRole = myPost.role === "at" ? "parent" : "at"

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("role", oppositeRole)
    .eq("active", true)
    .gt("expires_at", new Date().toISOString())
    .eq("zone", myPost.zone)

  if (error) {
    console.error("Error obteniendo matches:", error)
    return { data: [], error }
  }

  return { data, error: null }
}
