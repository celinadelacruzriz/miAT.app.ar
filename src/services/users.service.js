import { supabase } from "../lib/supabase";

/**
 * Asegura que el usuario autenticado exista en la tabla public.users
 */
async function ensurePublicUser(userId, email) {
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingUser) {
    console.log("Creando registro en public.users...");
    const { error } = await supabase.from("users").insert({ id: userId, email });
    if (error) {
      console.error("Error creando registro en public.users:", error);
      return { error };
    }
  }
  return { error: null };
}

export async function createUserProfile(userId, email, role) {
  console.log("DEBUG: createUserProfile parameters:", { userId, email, role });
  
  // 1. Aseguramos que el usuario esté en public.users para cumplir la FK
  const { error: userError } = await ensurePublicUser(userId, email);
  if (userError) return { error: userError };

  // 2. Insertamos el perfil en profiles
  // IMPORTANTE: Aseguramos que 'role' no sea undefined ni null
  if (!role) {
    return { error: { message: "Role is required but was undefined" } };
  }

  console.log("DEBUG: inserting into profiles table with type:", role);
  return supabase.from("profiles").insert({ 
    user_id: userId, 
    type: role 
  });
}

export async function updateUserRole(profileId, role) {
  return supabase.from("profiles").update({ type: role }).eq("id", profileId);
}
