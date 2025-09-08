import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Respuestas simuladas inteligentes para diferentes tipos de consultas sobre Walletfy
const getSmartResponse = (input, context) => {
  const lowerInput = input.toLowerCase();
  
  // Detectar patrones en la consulta
  if (lowerInput.includes('balance') || lowerInput.includes('dinero') || lowerInput.includes('cuánto tengo')) {
    return `📊 Tu situación financiera actual es la siguiente:
    
• Balance actual: $${context.currentBalance || '0.00'}
• Balance inicial: $${context.initialBalance || '0.00'}
• Ingresos totales: $${context.totalIncome || '0.00'}
• Gastos totales: $${context.totalExpenses || '0.00'}
• Balance neto: $${(context.totalIncome - context.totalExpenses) || '0.00'}

${context.currentBalance > context.initialBalance ? '🟢 ¡Genial! Has generado ganancias netas.' : '🟡 Ten cuidado, tus gastos están reduciendo tu balance inicial.'}`;
  }
  
  if (lowerInput.includes('gasto') || lowerInput.includes('expense') || lowerInput.includes('egresos')) {
    return `💸 Análisis de tus gastos:
    
• Total gastado: $${context.totalExpenses || '0.00'}
• Eventos de gastos: ${context.recentEvents?.filter(e => e.type === 'egreso')?.length || 0}

Gastos recientes:
${context.recentEvents?.filter(e => e.type === 'egreso')?.slice(0, 5)?.map((event, i) => 
  `${i + 1}. ${event.name}: $${event.amount} (${new Date(event.date).toLocaleDateString()})`
)?.join('\n') || 'No hay gastos recientes'}

💡 Consejo: Revisa si hay patrones en tus gastos que puedas optimizar.`;
  }
  
  if (lowerInput.includes('ingreso') || lowerInput.includes('income') || lowerInput.includes('ganancia')) {
    return `💰 Análisis de tus ingresos:
    
• Total de ingresos: $${context.totalIncome || '0.00'}
• Eventos de ingresos: ${context.recentEvents?.filter(e => e.type === 'ingreso')?.length || 0}

Ingresos recientes:
${context.recentEvents?.filter(e => e.type === 'ingreso')?.slice(0, 5)?.map((event, i) => 
  `${i + 1}. ${event.name}: $${event.amount} (${new Date(event.date).toLocaleDateString()})`
)?.join('\n') || 'No hay ingresos recientes'}

🎉 ¡Sigue así! Tus ingresos son la base de tu salud financiera.`;
  }
  
  if (lowerInput.includes('consejo') || lowerInput.includes('advice') || lowerInput.includes('recomendación')) {
    const ratio = context.totalIncome > 0 ? (context.totalExpenses / context.totalIncome * 100) : 0;
    return `💡 Consejos personalizados basados en tus datos:

• Ratio gasto/ingreso: ${ratio.toFixed(1)}%
${ratio > 80 ? '🚨 ALERTA: Estás gastando más del 80% de tus ingresos' : 
  ratio > 60 ? '⚠️ CUIDADO: Gastas más del 60% de tus ingresos' : 
  '✅ BIEN: Tu ratio de gastos es saludable'}

Recomendaciones específicas:
${ratio > 70 ? '• Identifica gastos no esenciales que puedas reducir' : '• Considera incrementar tus ahorros'}
• Establece un presupuesto mensual basado en tus patrones actuales
• Revisa tus gastos grandes periódicamente
${context.totalEvents < 10 ? '• Registra más transacciones para obtener análisis más precisos' : ''}

💪 ¡Estás en el camino correcto usando Walletfy para controlar tus finanzas!`;
  }
  
  if (lowerInput.includes('mes') || lowerInput.includes('mensual') || lowerInput.includes('month')) {
    return `📅 Análisis mensual de tus finanzas:

${context.monthlyData?.slice(-3)?.map(month => 
  `• ${month.monthName}: 
    - Ingresos: $${month.totalIncome}
    - Gastos: $${month.totalExpenses} 
    - Balance: $${month.monthlyBalance}
    - Balance acumulado: $${month.globalBalance}`
)?.join('\n\n') || 'No hay suficientes datos mensuales disponibles'}

📈 Tendencia: ${context.monthlyData && context.monthlyData.length > 1 ? 
  context.monthlyData[context.monthlyData.length - 1]?.monthlyBalance > 0 ? 'Positiva este mes' : 'Negativa este mes'
  : 'Necesitas más datos para análisis de tendencias'}`;
  }
  
  // Respuesta por defecto inteligente
  return `🤖 Soy tu asistente financiero de Walletfy y estoy aquí para ayudarte.

📊 Estado actual de tu cuenta:
• Balance: $${context.currentBalance}
• Total eventos: ${context.totalEvents}
• Últimas transacciones: ${context.recentEvents?.slice(0, 3)?.map(e => 
    `${e.name} ($${e.amount})`
  )?.join(', ') || 'Sin transacciones'}

Puedes preguntarme sobre:
• Tu balance y situación financiera
• Análisis de gastos e ingresos  
• Consejos personalizados
• Tendencias mensuales
• Cualquier aspecto específico de tus finanzas

💡 ¿En qué puedo ayudarte específicamente?`;
};

// Endpoint para streaming de respuestas
app.post('/api/completion/stream', (req, res) => {
  console.log('🎯 Consulta de streaming recibida al asistente Walletfy:');
  console.log('===============================');
  console.log('📝 Input:', req.body.input);
  console.log('⚙️ Params:', JSON.stringify(req.body.params, null, 2));
  
  const params = req.body.params || {};
  const input = req.body.input || '';
  
  // Validar parámetros (misma lógica que el endpoint normal)
  const validations = [];
  
  if (params.temperature < 0 || params.temperature > 2) {
    validations.push('❌ Temperatura fuera de rango [0, 2]');
  }
  
  if (params.top_p && (params.top_p < 0 || params.top_p > 1)) {
    validations.push('❌ Top-P fuera de rango [0, 1]');
  }
  
  if (params.top_k && (params.top_k < 0 || params.top_k > 20)) {
    validations.push('❌ Top-K fuera de rango [0, 20]');
  }
  
  if (params.top_p > 0 && params.top_k > 0) {
    validations.push('❌ Top-P y Top-K no pueden estar activos al mismo tiempo');
  }
  
  const validEfforts = ['minimal', 'low', 'medium', 'high'];
  if (!validEfforts.includes(params.reasoning_effort)) {
    validations.push('❌ Reasoning Effort inválido. Debe ser: minimal, low, medium o high');
  }
  
  if (validations.length > 0) {
    console.log('🚨 ERRORES DE VALIDACIÓN:');
    validations.forEach(error => console.log(error));
    return res.status(400).json({ error: validations.join(', ') });
  }
  
  // Configurar headers para Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Extraer contexto y pregunta del usuario
  let context = {
    currentBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalEvents: 0,
    initialBalance: 0,
    recentEvents: [],
    monthlyData: []
  };
  
  try {
    if (input.includes('CONTEXTO DE LA APLICACIÓN WALLETFY:')) {
      const contextMatch = input.match(/Balance actual: \$([0-9,]+\.?\d*)/);
      if (contextMatch) context.currentBalance = parseFloat(contextMatch[1].replace(',', ''));
      
      const incomeMatch = input.match(/Ingresos totales: \$([0-9,]+\.?\d*)/);
      if (incomeMatch) context.totalIncome = parseFloat(incomeMatch[1].replace(',', ''));
      
      const expensesMatch = input.match(/Gastos totales: \$([0-9,]+\.?\d*)/);
      if (expensesMatch) context.totalExpenses = parseFloat(expensesMatch[1].replace(',', ''));
      
      const eventsMatch = input.match(/Total de eventos registrados: (\d+)/);
      if (eventsMatch) context.totalEvents = parseInt(eventsMatch[1]);
      
      const balanceMatch = input.match(/Balance inicial del usuario: \$([0-9,]+\.?\d*)/);
      if (balanceMatch) context.initialBalance = parseFloat(balanceMatch[1].replace(',', ''));
    }
  } catch (e) {
    console.log('⚠️ Error extrayendo contexto:', e.message);
  }
  
  let userQuestion = input;
  const questionMatch = input.match(/PREGUNTA DEL USUARIO:\s*(.*?)$/s);
  if (questionMatch) {
    userQuestion = questionMatch[1].trim();
  }
  
  console.log('🤔 Pregunta del usuario:', userQuestion);
  console.log('💰 Contexto extraído:', JSON.stringify(context, null, 2));
  console.log('🌊 Iniciando streaming...');
  console.log('===============================\n');
  
  // Generar respuesta inteligente y enviarla en chunks
  const fullResponse = getSmartResponse(userQuestion, context);
  const words = fullResponse.split(' ');
  
  // Configurar velocidad del streaming según reasoning effort
  const streamingDelays = { minimal: 50, low: 100, medium: 150, high: 200 };
  const delay = streamingDelays[params.reasoning_effort] || 150;
  
  let currentIndex = 0;
  const chunkSize = Math.max(1, Math.floor(words.length / 20)); // Dividir en ~20 chunks
  
  const streamInterval = setInterval(() => {
    if (currentIndex >= words.length) {
      // Enviar evento de finalización
      res.write('data: [DONE]\n\n');
      res.end();
      clearInterval(streamInterval);
      console.log('✅ Streaming completado');
      return;
    }
    
    // Tomar el siguiente chunk de palabras
    const chunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ');
    currentIndex += chunkSize;
    
    // Enviar el chunk
    const eventData = {
      chunk: chunk + (currentIndex < words.length ? ' ' : ''),
      isComplete: currentIndex >= words.length
    };
    
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    console.log(`📤 Enviado chunk: "${chunk.substring(0, 50)}..."`);
    
  }, delay);
  
  // Manejar desconexión del cliente
  req.on('close', () => {
    clearInterval(streamInterval);
    console.log('🔌 Cliente desconectado, streaming cancelado');
  });
});

// Endpoint para el chat con contexto inteligente (modo normal)
app.post('/api/completion', (req, res) => {
  console.log('🎯 Consulta recibida al asistente Walletfy:');
  console.log('===============================');
  console.log('📝 Input:', req.body.input);
  console.log('⚙️ Params:', JSON.stringify(req.body.params, null, 2));
  
  const params = req.body.params || {};
  const input = req.body.input || '';
  
  // Validar parámetros
  const validations = [];
  
  if (params.temperature < 0 || params.temperature > 2) {
    validations.push('❌ Temperatura fuera de rango [0, 2]');
  }
  
  if (params.top_p && (params.top_p < 0 || params.top_p > 1)) {
    validations.push('❌ Top-P fuera de rango [0, 1]');
  }
  
  if (params.top_k && (params.top_k < 0 || params.top_k > 20)) {
    validations.push('❌ Top-K fuera de rango [0, 20]');
  }
  
  if (params.top_p > 0 && params.top_k > 0) {
    validations.push('❌ Top-P y Top-K no pueden estar activos al mismo tiempo');
  }
  
  const validEfforts = ['minimal', 'low', 'medium', 'high'];
  if (!validEfforts.includes(params.reasoning_effort)) {
    validations.push('❌ Reasoning Effort inválido. Debe ser: minimal, low, medium o high');
  }
  
  if (validations.length > 0) {
    console.log('🚨 ERRORES DE VALIDACIÓN:');
    validations.forEach(error => console.log(error));
    console.log('===============================\n');
    return res.status(400).json({ error: validations.join(', ') });
  }
  
  console.log('✅ Validaciones pasadas correctamente');
  
  // Extraer contexto de Walletfy del input (debería venir en el prompt)
  let context = {
    currentBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalEvents: 0,
    initialBalance: 0,
    recentEvents: [],
    monthlyData: []
  };
  
  // Intentar extraer información del contexto que viene en el input
  try {
    if (input.includes('CONTEXTO DE LA APLICACIÓN WALLETFY:')) {
      const contextMatch = input.match(/Balance actual: \$([0-9,]+\.?\d*)/);
      if (contextMatch) context.currentBalance = parseFloat(contextMatch[1].replace(',', ''));
      
      const incomeMatch = input.match(/Ingresos totales: \$([0-9,]+\.?\d*)/);
      if (incomeMatch) context.totalIncome = parseFloat(incomeMatch[1].replace(',', ''));
      
      const expensesMatch = input.match(/Gastos totales: \$([0-9,]+\.?\d*)/);
      if (expensesMatch) context.totalExpenses = parseFloat(expensesMatch[1].replace(',', ''));
      
      const eventsMatch = input.match(/Total de eventos registrados: (\d+)/);
      if (eventsMatch) context.totalEvents = parseInt(eventsMatch[1]);
      
      const balanceMatch = input.match(/Balance inicial del usuario: \$([0-9,]+\.?\d*)/);
      if (balanceMatch) context.initialBalance = parseFloat(balanceMatch[1].replace(',', ''));
    }
  } catch (e) {
    console.log('⚠️ Error extrayendo contexto:', e.message);
  }
  
  // Obtener la pregunta real del usuario (después de "PREGUNTA DEL USUARIO:")
  let userQuestion = input;
  const questionMatch = input.match(/PREGUNTA DEL USUARIO:\s*(.*?)$/s);
  if (questionMatch) {
    userQuestion = questionMatch[1].trim();
  }
  
  console.log('🤔 Pregunta del usuario:', userQuestion);
  console.log('💰 Contexto extraído:', JSON.stringify(context, null, 2));
  console.log('===============================\n');
  
  const response = {
    message: getSmartResponse(userQuestion, context)
  };
  
  // Simular delay de procesamiento basado en reasoning effort
  const delays = { minimal: 500, low: 800, medium: 1200, high: 2000 };
  const delay = delays[params.reasoning_effort] || 1000;
  
  setTimeout(() => {
    res.json(response);
  }, delay);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log('🚀 Servidor de chat inteligente Walletfy corriendo en http://localhost:4000');
  console.log('📡 Endpoint disponible: POST /api/completion');
  console.log('🤖 ¡Listo para responder consultas financieras!\n');
});
