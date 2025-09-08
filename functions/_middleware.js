// Cloudflare Pages Function para el chat backend
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Solo manejar rutas API
  if (!url.pathname.startsWith('/api/')) {
    return;
  }

  // Función para generar respuestas inteligentes
  function getSmartResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('balance') || lowerMessage.includes('saldo')) {
      const totalIncome = context.events
        ?.filter(e => e.type === 'income')
        ?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const totalExpense = context.events
        ?.filter(e => e.type === 'expense')
        ?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const balance = totalIncome - totalExpense;
      
      return `Tu balance actual es de $${balance.toFixed(2)}. Tienes $${totalIncome.toFixed(2)} en ingresos y $${totalExpense.toFixed(2)} en gastos.`;
    }

    if (lowerMessage.includes('gasto') || lowerMessage.includes('expense')) {
      const expenses = context.events?.filter(e => e.type === 'expense') || [];
      if (expenses.length > 0) {
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const categories = [...new Set(expenses.map(e => e.category))];
        return `Tienes un total de $${totalExpenses.toFixed(2)} en gastos distribuidos en ${categories.length} categorías: ${categories.join(', ')}.`;
      }
      return 'No tienes gastos registrados aún.';
    }

    if (lowerMessage.includes('ingreso') || lowerMessage.includes('income')) {
      const incomes = context.events?.filter(e => e.type === 'income') || [];
      if (incomes.length > 0) {
        const totalIncomes = incomes.reduce((sum, e) => sum + e.amount, 0);
        return `Tienes un total de $${totalIncomes.toFixed(2)} en ingresos de ${incomes.length} fuentes diferentes.`;
      }
      return 'No tienes ingresos registrados aún.';
    }

    if (lowerMessage.includes('consejo') || lowerMessage.includes('advice')) {
      const balance = (context.events?.filter(e => e.type === 'income')?.reduce((sum, e) => sum + e.amount, 0) || 0) -
                     (context.events?.filter(e => e.type === 'expense')?.reduce((sum, e) => sum + e.amount, 0) || 0);
      
      if (balance > 0) {
        return '¡Excelente! Tienes un balance positivo. Te recomiendo ahorrar al menos el 20% de tus ingresos y considerar invertir en fondos de emergencia.';
      } else if (balance < 0) {
        return 'Tu balance es negativo. Te sugiero revisar tus gastos, identificar categorías donde puedas reducir costos, y crear un presupuesto mensual.';
      } else {
        return 'Tu balance está equilibrado. Considera crear metas de ahorro y un fondo de emergencia para mejorar tu estabilidad financiera.';
      }
    }

    // Respuestas generales sobre finanzas
    const responses = [
      'Como asistente de Walletfy, puedo ayudarte con tus finanzas personales. ¿Te gustaría conocer tu balance actual?',
      'Estoy aquí para ayudarte a gestionar mejor tu dinero. Puedes preguntarme sobre gastos, ingresos o consejos financieros.',
      'Con Walletfy puedes tener control total de tus finanzas. ¿Hay algo específico sobre tu situación financiera que te gustaría saber?',
      'Soy tu asistente financiero inteligente. Puedo analizar tus datos y darte insights personalizados sobre tu economía.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Endpoint para completion normal
  if (url.pathname === '/api/completion' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { message, context = {} } = body;
      
      const response = getSmartResponse(message, context);
      
      return new Response(JSON.stringify({ 
        response,
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Error procesando la solicitud',
        details: error.message 
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
      const body = await request.json();
      const { message, context = {} } = body;
      
      const response = getSmartResponse(message, context);
      
      // Simular streaming dividiendo la respuesta en chunks
      const chunks = response.split(' ');
      let streamData = '';
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '');
        streamData += `data: ${JSON.stringify({ 
          content: chunk,
          done: i === chunks.length - 1 
        })}\n\n`;
      }
      
      streamData += 'data: [DONE]\n\n';
      
      return new Response(streamData, {
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
        details: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  // Si no es una ruta API que manejamos, continuar
  return;
}
