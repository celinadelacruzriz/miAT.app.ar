import { supabase } from "../lib/supabase";

/**
 * Crea un post en estado draft (inactive)
 * Se usa antes del pago
 * Solo usuarios autenticados
 */
export async function createPostDraft(postData) {
  const user = supabase.auth.user();
  if (!user) {
    return { data: null, error: { message: "Usuario no autenticado" } };
  }

  const {
    role,
    zone,
    age_range,
    diagnosis,
    schedule,
    experience_years,
    intent,
    specialty,
    modalidad,
    celular,
  } = postData;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      role,
      zone,
      age_range: age_range ?? null,
      diagnosis: diagnosis ?? [],
      schedule,
      experience_years: experience_years ?? null,
      intent: intent ?? null,
      specialty: specialty ?? null,
      modalidad: modalidad ?? null,
      celular: celular ?? null,
      user_id: user.id, // <-- clave para policy RLS
      active: false,    // <-- inactivo hasta pago
      expires_at: null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando post draft:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Activa un post luego del pago
 * Setea expires_at = now + 30 días
 */
export async function activatePost(postId) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data, error } = await supabase
    .from("posts")
    .update({
      active: true,
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("Error activando post:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
