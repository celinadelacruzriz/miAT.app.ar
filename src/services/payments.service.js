// src/services/payment.service.js
import { supabase } from "../lib/supabase";

/**
 * Crea una preferencia de pago en MercadoPago vía Edge Function
 * Retorna preferenceId e init_point
 */
export async function createMercadoPagoPreference(
  postId,
  title = "Publicación MiatApp",
  price = 1000,
) {
  if (!postId) {
    throw new Error("postId es requerido");
  }

  const { data, error } = await supabase.functions.invoke("create-preference", {
    body: { postId, title, price },
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
    },
  });

  if (error) {
    console.error("Error creando preferencia MercadoPago:", error);
    return { preferenceId: null, init_point: null, error };
  }

  return {
    preferenceId: data.preferenceId,
    init_point: data.init_point,
    error: null,
  };
}
