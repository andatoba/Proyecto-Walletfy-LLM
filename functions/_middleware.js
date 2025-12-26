// Cloudflare Pages Function para el chat backend
export async function onRequest(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const MAX_INPUT_LENGTH = 4000;
    const chatApiKey = context.env?.WALLETFY_CHAT_KEY;
    
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Manejar preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200,
        headers: corsHeaders 
      });
    }

    // Solo manejar rutas API
    if (!url.pathname.startsWith('/api/')) {
      return;
    }

    const getApiKey = () => {
      const authHeader = request.headers.get('authorization') || request.headers.get('x-api-key');
      if (!authHeader) return null;
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        return authHeader.slice(7).trim();
      }
      return authHeader.trim();
    };

    // Función para generar respuestas inteligentes
    function getSmartResponse(input = '', contextData = {}) {
      try {
        const message = String(input || '').toLowerCase();
        
        if (message.includes('balance') || message.includes('saldo')) {
          return `Basándome en tus datos de Walletfy, puedo ayudarte a analizar tu balance actual. Tu aplicación me proporciona información detallada sobre tus ingresos y gastos.`;
        }

        if (message.includes('gasto') || message.includes('expense')) {
          return `Puedo ayudarte a analizar tus patrones de gasto. Con la información de tu aplicación Walletfy, podemos identificar categorías de gastos y tendencias de consumo.`;
        }

        if (message.includes('ingreso') || message.includes('income')) {
          return `Excelente pregunta sobre ingresos. Con los datos de tu aplicación, puedo ayudarte a entender mejor tus fuentes de ingresos y su evolución temporal.`;
        }

        if (message.includes('consejo') || message.includes('advice')) {
          return `Como tu asistente financiero de Walletfy, puedo ofrecerte consejos personalizados basados en tus datos reales de ingresos y gastos. ¿Hay algún aspecto específico de tus finanzas que te gustaría analizar?`;
        }

        // Respuesta por defecto
        return `¡Hola! Soy tu asistente financiero de Walletfy. Puedo ayudarte a analizar tus finanzas, identificar patrones de gasto, revisar tu balance y darte consejos personalizados. ¿En qué puedo ayudarte hoy?`;
      } catch (error) {
        return `Disculpa, hubo un error procesando tu mensaje. Por favor, intenta de nuevo.`;
      }
    }

    // Endpoint principal de completion
    if (url.pathname === '/api/completion' && request.method === 'POST') {
      try {
        if (!chatApiKey) {
          return new Response(JSON.stringify({ error: 'Servidor no configurado' }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const apiKey = getApiKey();
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'API key requerida' }), {
            status: 401,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        if (apiKey !== chatApiKey) {
          return new Response(JSON.stringify({ error: 'API key inválida' }), {
            status: 403,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const body = await request.json().catch(() => ({}));
        const input = body.input || body.message || '';
        const context = body.context || {};

        if (typeof input === 'string' && input.length > MAX_INPUT_LENGTH) {
          return new Response(JSON.stringify({ 
            error: 'El input supera el tamaño permitido'
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        
        const response = getSmartResponse(input, context);
        
        return new Response(JSON.stringify({ 
          message: response,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Error procesando la solicitud',
          message: 'Lo siento, hubo un problema. Por favor intenta de nuevo.'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // Endpoint para streaming
    if (url.pathname === '/api/completion/stream' && request.method === 'POST') {
      try {
        if (!chatApiKey) {
          return new Response(JSON.stringify({ error: 'Servidor no configurado' }), {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const apiKey = getApiKey();
        if (!apiKey) {
          return new Response(JSON.stringify({ error: 'API key requerida' }), {
            status: 401,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        if (apiKey !== chatApiKey) {
          return new Response(JSON.stringify({ error: 'API key inválida' }), {
            status: 403,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const body = await request.json().catch(() => ({}));
        const input = body.input || body.message || '';
        const context = body.context || {};

        if (typeof input === 'string' && input.length > MAX_INPUT_LENGTH) {
          return new Response(JSON.stringify({ 
            error: 'El input supera el tamaño permitido'
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
        
        const response = getSmartResponse(input, context);
        
        // Simular streaming dividiendo la respuesta en palabras
        const words = response.split(' ');
        let streamData = '';
        
        // Enviar palabras de a poco para simular streaming
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          streamData += `data: ${JSON.stringify({ 
            chunk: word
          })}\n\n`;
        }
        
        streamData += 'data: [DONE]\n\n';
        
        return new Response(streamData, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...corsHeaders
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Error en streaming',
          message: 'Problema con la respuesta en tiempo real'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // Ruta no encontrada
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ 
        error: 'Endpoint no encontrado',
        path: url.pathname 
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // No es una ruta API, continuar con el siguiente middleware
    return;

  } catch (error) {
    // Error general del middleware
    return new Response(JSON.stringify({ 
      error: 'Error del servidor',
      message: 'Error interno del middleware'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
