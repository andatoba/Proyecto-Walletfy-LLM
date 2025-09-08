import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { calculateMonthlyBalances } from '../../utils/balanceCalculations'
import ConfigurationPanel from './ConfigurationPanel'
import type { ChatConfig } from './ConfigurationPanel'
import type { RootState } from '../../store'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatResponse {
  message: string
}

interface WalletfyContext {
  initialBalance: number
  totalEvents: number
  totalIncome: number
  totalExpenses: number
  currentBalance: number
  monthlyData: Array<{
    month: string
    monthName: string
    totalIncome: number
    totalExpenses: number
    monthlyBalance: number
    globalBalance: number
    eventCount: number
  }>
  recentEvents: Array<{
    name: string
    description?: string
    amount: number
    type: 'ingreso' | 'egreso'
    date: string
  }>
}

// Función para crear el contexto de Walletfy
function createWalletfyContext(events: Array<any>, initialBalance: number): WalletfyContext {
  const monthlyBalances = calculateMonthlyBalances(events, initialBalance)
  
  // Calcular totales
  const totalIncome = events.filter(e => e.type === 'ingreso').reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = events.filter(e => e.type === 'egreso').reduce((sum, e) => sum + e.amount, 0)
  const currentBalance = initialBalance + totalIncome - totalExpenses
  
  // Obtener eventos recientes (últimos 10)
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map(e => ({
      name: e.name,
      description: e.description,
      amount: e.amount,
      type: e.type,
      date: e.date
    }))

  return {
    initialBalance,
    totalEvents: events.length,
    totalIncome,
    totalExpenses,
    currentBalance,
    monthlyData: monthlyBalances.map(mb => ({
      month: mb.month,
      monthName: mb.monthName,
      totalIncome: mb.totalIncome,
      totalExpenses: mb.totalExpenses,
      monthlyBalance: mb.monthlyBalance,
      globalBalance: mb.globalBalance,
      eventCount: mb.events.length
    })),
    recentEvents
  }
}

// Función para llamar al servidor de chat con contexto (con streaming)
async function sendMessage(message: string, config: ChatConfig, context: WalletfyContext): Promise<ChatResponse> {
  // Validar parámetros antes de enviar
  const validatedConfig = {
    ...config,
    temperature: Math.max(0, Math.min(2, config.temperature)),
    topP: Math.max(0, Math.min(1, config.topP)),
    topK: Math.max(0, Math.min(20, config.topK)),
  }

  // Crear el system prompt con contexto de Walletfy
  const contextualPrompt = `${config.systemPrompt}

CONTEXTO DE LA APLICACIÓN WALLETFY:
- Balance inicial del usuario: $${context.initialBalance}
- Balance actual: $${context.currentBalance.toFixed(2)}
- Total de eventos registrados: ${context.totalEvents}
- Ingresos totales: $${context.totalIncome.toFixed(2)}
- Gastos totales: $${context.totalExpenses.toFixed(2)}
- Balance neto: $${(context.totalIncome - context.totalExpenses).toFixed(2)}

DATOS POR MES:
${context.monthlyData.map(month => 
  `• ${month.monthName}: ${month.eventCount} eventos, Ingresos: $${month.totalIncome.toFixed(2)}, Gastos: $${month.totalExpenses.toFixed(2)}, Balance del mes: $${month.monthlyBalance.toFixed(2)}, Balance acumulado: $${month.globalBalance.toFixed(2)}`
).join('\n')}

EVENTOS RECIENTES (últimos 10):
${context.recentEvents.map((event, index) => 
  `${index + 1}. ${event.name} - $${event.amount} (${event.type}) - ${new Date(event.date).toLocaleDateString()}`
).join('\n')}

Usa esta información para proporcionar respuestas precisas y útiles sobre las finanzas del usuario. Puedes analizar patrones, dar consejos, identificar tendencias y responder preguntas específicas basándote en estos datos reales.`

  // Crear el objeto params según el formato requerido
  const params: any = {
    temperature: validatedConfig.temperature,
    reasoning_effort: validatedConfig.reasoningEffort,
  }

  // Solo agregar el parámetro de sampling activo
  if (validatedConfig.topP > 0) {
    params.top_p = validatedConfig.topP
  } else if (validatedConfig.topK > 0) {
    params.top_k = validatedConfig.topK
  }

  // Body en el formato solicitado
  const requestBody = {
    input: `CONTEXTO: ${contextualPrompt}\n\nPREGUNTA DEL USUARIO: ${message}`,
    params: params
  }

  const response = await fetch(validatedConfig.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error('Error al enviar mensaje')
  }

  const data = await response.json()
  return { message: data.message || data.content || 'Sin respuesta' }
}

// Función adicional para streaming (IMPLEMENTADA)
async function sendMessageWithStreaming(
  message: string, 
  config: ChatConfig, 
  context: WalletfyContext,
  onChunk: (chunk: string) => void,
  onComplete: (fullMessage: string) => void,
  onError: (error: string) => void
): Promise<void> {
  // Validar parámetros antes de enviar
  const validatedConfig = {
    ...config,
    temperature: Math.max(0, Math.min(2, config.temperature)),
    topP: Math.max(0, Math.min(1, config.topP)),
    topK: Math.max(0, Math.min(20, config.topK)),
  }

  // Crear el system prompt con contexto de Walletfy
  const contextualPrompt = `${config.systemPrompt}

CONTEXTO DE LA APLICACIÓN WALLETFY:
- Balance inicial del usuario: $${context.initialBalance}
- Balance actual: $${context.currentBalance.toFixed(2)}
- Total de eventos registrados: ${context.totalEvents}
- Ingresos totales: $${context.totalIncome.toFixed(2)}
- Gastos totales: $${context.totalExpenses.toFixed(2)}
- Balance neto: $${(context.totalIncome - context.totalExpenses).toFixed(2)}

DATOS POR MES:
${context.monthlyData.map(month => 
  `• ${month.monthName}: ${month.eventCount} eventos, Ingresos: $${month.totalIncome.toFixed(2)}, Gastos: $${month.totalExpenses.toFixed(2)}, Balance del mes: $${month.monthlyBalance.toFixed(2)}, Balance acumulado: $${month.globalBalance.toFixed(2)}`
).join('\n')}

EVENTOS RECIENTES (últimos 10):
${context.recentEvents.map((event, index) => 
  `${index + 1}. ${event.name} - $${event.amount} (${event.type}) - ${new Date(event.date).toLocaleDateString()}`
).join('\n')}

Usa esta información para proporcionar respuestas precisas y útiles sobre las finanzas del usuario. Puedes analizar patrones, dar consejos, identificar tendencias y responder preguntas específicas basándote en estos datos reales.`

  // Crear el objeto params según el formato requerido
  const params: any = {
    temperature: validatedConfig.temperature,
    reasoning_effort: validatedConfig.reasoningEffort,
  }

  // Solo agregar el parámetro de sampling activo
  if (validatedConfig.topP > 0) {
    params.top_p = validatedConfig.topP
  } else if (validatedConfig.topK > 0) {
    params.top_k = validatedConfig.topK
  }

  // Body en el formato solicitado
  const requestBody = {
    input: `CONTEXTO: ${contextualPrompt}\n\nPREGUNTA DEL USUARIO: ${message}`,
    params: params
  }

  try {
    const response = await fetch(validatedConfig.apiEndpoint + '/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error('Error al conectar con el servidor de streaming')
    }

    if (!response.body) {
      throw new Error('El servidor no soporta streaming')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullMessage = ''

    try {
      let reading = true
      while (reading) {
        const { done, value } = await reader.read()
        
        if (done) {
          reading = false
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            
            if (data === '[DONE]') {
              onComplete(fullMessage)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.chunk) {
                fullMessage += parsed.chunk
                onChunk(parsed.chunk)
              }
            } catch (e) {
              // Ignorar líneas que no sean JSON válido
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Error desconocido durante el streaming')
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<Message>>([])
  const [inputValue, setInputValue] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [context, setContext] = useState<WalletfyContext | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')
  const [streamingEnabled, setStreamingEnabled] = useState(true) // Nueva opción para habilitar/deshabilitar streaming
  const [config, setConfig] = useState<ChatConfig>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    topP: 1.0,
    topK: 0, // Desactivado por defecto (usando top-p)
    reasoningEffort: 'medium',
    maxTokens: 1000,
    systemPrompt: 'Eres un asistente financiero especializado en la aplicación Walletfy. Tu trabajo es ayudar a los usuarios a entender y gestionar mejor sus finanzas personales basándote en los datos de su aplicación. Proporciona consejos útiles, análisis de patrones de gasto, y responde preguntas específicas sobre sus transacciones e ingresos.',
    apiEndpoint: 'http://localhost:4000/api/completion'
  })

  // Seleccionar datos del store de Redux
  const events = useSelector((state: RootState) => state.events.events)
  const initialBalance = useSelector((state: RootState) => state.app.initialBalance)

  // Actualizar contexto cuando cambien los datos
  useEffect(() => {
    const walletfyContext = createWalletfyContext(events, initialBalance)
    setContext(walletfyContext)
  }, [events, initialBalance])

  const chatMutation = useMutation({
    mutationFn: (message: string) => {
      if (!context) throw new Error('Contexto de la aplicación no disponible')
      return sendMessage(message, config, context)
    },
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: `❌ Error: ${error.message}`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || chatMutation.isPending || !context || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    
    // Usar streaming si está habilitado
    if (streamingEnabled) {
      setIsStreaming(true)
      setCurrentStreamingMessage('')
      
      // Crear mensaje temporal para streaming
      const streamingMessageId = Date.now().toString() + '-streaming'
      const tempMessage: Message = {
        id: streamingMessageId,
        content: '',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, tempMessage])
      
      sendMessageWithStreaming(
        inputValue,
        config,
        context,
        // onChunk: actualizar el mensaje en tiempo real
        (chunk: string) => {
          setCurrentStreamingMessage(prev => {
            const newContent = prev + chunk
            setMessages((msgs) => 
              msgs.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, content: newContent }
                  : msg
              )
            )
            return newContent
          })
        },
        // onComplete: finalizar streaming
        (fullMessage: string) => {
          setIsStreaming(false)
          setCurrentStreamingMessage('')
          setMessages((msgs) => 
            msgs.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, content: fullMessage }
                : msg
            )
          )
        },
        // onError: manejar errores de streaming
        (error: string) => {
          setIsStreaming(false)
          setCurrentStreamingMessage('')
          const errorMessage: Message = {
            id: Date.now().toString() + '-error',
            content: `❌ Error de streaming: ${error}`,
            isUser: false,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      )
    } else {
      // Usar el método tradicional sin streaming
      chatMutation.mutate(inputValue)
    }
    
    setInputValue('')
  }

  const clearChat = () => {
    setMessages([])
  }

  if (!context) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contexto de la aplicación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Asistente Financiero Walletfy
              {streamingEnabled && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🌊 Streaming</span>}
            </h1>
            <p className="text-sm text-gray-600">
              Balance actual: ${context.currentBalance.toFixed(2)} • {context.totalEvents} eventos registrados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle de streaming */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={streamingEnabled}
              onChange={(e) => setStreamingEnabled(e.target.checked)}
              className="rounded"
              disabled={isStreaming || chatMutation.isPending}
            />
            Streaming
          </label>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
          >
            🗑️ Limpiar Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <span className="text-4xl block mb-4">💰</span>
            <h3 className="text-lg font-medium mb-2">¡Hola! Soy tu asistente financiero de Walletfy</h3>
            <p className="text-sm mb-4">Puedo ayudarte a:</p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm">
              <p>• 📊 Analizar tus patrones de gasto e ingreso</p>
              <p>• 💡 Darte consejos financieros personalizados</p>
              <p>• 📈 Revisar tu balance y tendencias mensuales</p>
              <p>• 🔍 Buscar información específica de tus transacciones</p>
              <p>• 🎯 Ayudarte a planificar mejor tu presupuesto</p>
            </div>
            <p className="text-sm mt-4 text-blue-600">Escribe cualquier pregunta sobre tus finanzas para comenzar</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2 max-w-xs md:max-w-md lg:max-w-2xl`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {(chatMutation.isPending || isStreaming) && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm px-4 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">
                    {isStreaming ? '🌊 Generando respuesta en tiempo real' : 'Analizando tus datos financieros'}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      <ConfigurationPanel
        config={config}
        onConfigChange={setConfig}
        isVisible={showConfig}
        onToggleVisibility={() => setShowConfig(!showConfig)}
      />

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={streamingEnabled ? "Pregúntame (modo streaming activado)..." : "Pregúntame sobre tus finanzas, patrones de gasto, consejos, etc..."}
            disabled={chatMutation.isPending || isStreaming}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || chatMutation.isPending || isStreaming}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span>{streamingEnabled ? '🌊' : '💬'}</span>
            {isStreaming ? 'Generando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
