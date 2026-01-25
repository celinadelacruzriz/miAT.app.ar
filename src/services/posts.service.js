import { supabase } from "../lib/supabase";

/**
 * Crea un post en estado draft (inactive)
 * Se usa al guardar el formulario
 */
export async function createPostDraft(postData) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      data: null,
      error: { message: "Usuario no autenticado" },
    };
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
    email,
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
      email: user.email,
      user_id: user.id,
      active: false,
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
 */
export async function activatePost(postId) {
  if (!postId) {
    throw new Error("postId requerido para activar post");
  }

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
