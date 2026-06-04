// supabase/functions/bug-to-discord/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS' // <-- Clave para que el preflight no falle
}

Deno.serve(async (req) => {
  // Manejo del Preflight de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
    if (!webhookUrl) {
      throw new Error('La variable de entorno DISCORD_WEBHOOK_URL no está configurada.')
    }

    const body = await req.json()

    // Enviar a Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: body.type === 'bug' ? '🐛 Bug reportado' : '💛 Feedback recibido',
            color: body.type === 'bug' ? 15158332 : 16776960,
            fields: [
              { name: 'App', value: body.record.app_id || 'Dadoverse' },
              { name: 'Título', value: body.record.title || 'Sin título' },
              { name: 'Descripción', value: body.record.description || 'Sin descripción' },
              { name: 'Versión', value: body.record.app_version || 'N/A', inline: true },
              { name: 'Contacto', value: body.record.contact_email || 'Anónimo', inline: true }
            ]
          }
        ]
      })
    })

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text()
      throw new Error(`Discord API error: ${errorText}`)
    }

    // Respuesta exitosa con CORS
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    // Si algo falla, atrapamos el error y devolvemos CORS para poder leerlo en la consola del frontend
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
