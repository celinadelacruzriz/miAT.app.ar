import { CAFECITO_URL } from "../config/payments";
import { supabase } from "../lib/supabase";

/**
 * Crea una preferencia de pago en MercadoPago via Edge Function
 */
export async function createPreference(
  postId,
  title = "Publicación MiatApp",
  price = 1000,
) {
  const { data, error } = await supabase.functions.invoke("create-preference", {
    body: { postId, title, price },
  });

  if (error) {
    console.error("Error creating preference:", error);
    return { preferenceId: null, error };
  }

  return {
    preferenceId: data.preferenceId,
    init_point: data.init_point,
    error: null,
  };
}

/**
 * Genera la URL de pago para Cafecito
 * Se usa tanto para pagar como para renovar
 */
export function getCafecitoPaymentUrl(postId) {
  if (!postId) {
    throw new Error("postId requerido para generar link de pago");
  }

  return `${CAFECITO_URL}?ref=post_${postId}`;
}
