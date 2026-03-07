/// <reference lib="deno.ns" />
import { corsHeaders } from "../_shared/cors.ts"
// @ts-ignore
import { MercadoPagoConfig, Preference } from "npm:mercadopago@2.0.9";


Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { postId, title, price } = await req.json()

    if (!postId) {
      throw new Error("postId requerido")
    }

    const accessToken = Deno.env.get("MP_ACCESS_TOKEN")

    if (!accessToken) {
      throw new Error("MP_ACCESS_TOKEN no configurado")
    }

    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const origin = req.headers.get("origin") || "http://localhost:5173"

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(postId),
            title: title || "Publicación MiAT",
            quantity: 1,
            unit_price: price || 1000,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${origin}/payment-success?postId=${postId}`,
          failure: `${origin}/payment-failure`,
          pending: `${origin}/payment-pending`,
        },
        auto_return: "approved",
        external_reference: String(postId),
      },
    })

    return new Response(
      JSON.stringify({
        preferenceId: result.id,
        init_point: result.init_point,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})