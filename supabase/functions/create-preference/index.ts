import { corsHeaders } from '../_shared/cors.ts'
import { MercadoPagoConfig, Preference } from 'mercadopago'

console.log("Hello from create-preference!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { postId, title, price } = await req.json()
    
    // Initialize MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get('MP_ACCESS_TOKEN') || '', 
    });

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: postId,
            title: title || 'Publicación en MiatApp',
            quantity: 1,
            unit_price: Number(price) || 1000, // Precio por defecto
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${req.headers.get('origin')}/payment-success?postId=${postId}`,
          failure: `${req.headers.get('origin')}/payment-failure`,
          pending: `${req.headers.get('origin')}/payment-pending`,
        },
        auto_return: 'approved',
        external_reference: postId,
      }
    })

    return new Response(
      JSON.stringify({ preferenceId: result.id, init_point: result.init_point }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
