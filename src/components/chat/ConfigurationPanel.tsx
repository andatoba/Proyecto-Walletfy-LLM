import { useState } from 'react'

export type ReasoningEffort = 'minimal' | 'low' | 'medium' | 'high'

export interface ChatConfig {
  model: string
  temperature: number
  topP: number
  topK: number
  reasoningEffort: ReasoningEffort
  maxTokens: number
  systemPrompt: string
  apiEndpoint: string
}

interface ConfigurationPanelProps {
  config: ChatConfig
  onConfigChange: (config: ChatConfig) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

const AVAILABLE_MODELS = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'llama-2-70b', name: 'Llama 2 70B' },
]

const REASONING_EFFORT_OPTIONS: Array<{
  id: ReasoningEffort
  name: string
  description: string
}> = [
  { id: 'minimal', name: 'Mínimo', description: 'Respuestas muy rápidas y básicas' },
  { id: 'low', name: 'Bajo', description: 'Respuestas rápidas y directas' },
  { id: 'medium', name: 'Medio', description: 'Balance entre velocidad y razonamiento' },
  { id: 'high', name: 'Alto', description: 'Razonamiento profundo y detallado' },
]

export default function ConfigurationPanel({ 
  config, 
  onConfigChange, 
  isVisible, 
  onToggleVisibility 
}: ConfigurationPanelProps) {
  const [localConfig, setLocalConfig] = useState<ChatConfig>(config)
  const [samplingMode, setSamplingMode] = useState<'top-p' | 'top-k'>('top-p')

  const handleSave = () => {
    // Validaciones
    const validatedConfig = { ...localConfig }
    
    // Validar temperatura [0, 2]
    validatedConfig.temperature = Math.max(0, Math.min(2, validatedConfig.temperature))
    
    // Validar top-k [0, 20] 
    validatedConfig.topK = Math.max(0, Math.min(20, validatedConfig.topK))
    
    // Validar top-p [0, 1]
    validatedConfig.topP = Math.max(0, Math.min(1, validatedConfig.topP))
    
    // Solo permitir uno: top-p o top-k
    if (samplingMode === 'top-p') {
      validatedConfig.topK = 0 // Desactivar top-k
    } else {
      validatedConfig.topP = 0 // Desactivar top-p
    }
    
    // Validar reasoning effort
    const validEfforts: ReasoningEffort[] = ['minimal', 'low', 'medium', 'high']
    if (!validEfforts.includes(validatedConfig.reasoningEffort)) {
      validatedConfig.reasoningEffort = 'medium'
    }
    
    setLocalConfig(validatedConfig)
    onConfigChange(validatedConfig)
    onToggleVisibility()
  }

  const handleReset = () => {
    const defaultConfig: ChatConfig = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      topP: 1.0,
      topK: 0, // Desactivado por defecto (usando top-p)
      reasoningEffort: 'medium',
      maxTokens: 1000,
      systemPrompt: 'Eres un asistente financiero especializado en la aplicación Walletfy. Tu trabajo es ayudar a los usuarios a entender y gestionar mejor sus finanzas personales basándote en los datos de su aplicación. Proporciona consejos útiles, análisis de patrones de gasto, y responde preguntas específicas sobre sus transacciones e ingresos.',
      apiEndpoint: 'http://localhost:4000/api/completion'
    }
    setLocalConfig(defaultConfig)
  }

  if (!isVisible) {
    return (
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span>⚙️</span>
          Configuración
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {config.model}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <span>⚙️</span>
          Configuración del Chat
        </h3>
        <button
          onClick={onToggleVisibility}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Modelo */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo
          </label>
          <select
            value={localConfig.model}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {AVAILABLE_MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperatura: {localConfig.temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={localConfig.temperature}
            onChange={(e) => {
              const value = Math.max(0, Math.min(2, parseFloat(e.target.value)))
              setLocalConfig(prev => ({ ...prev, temperature: value }))
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Más preciso (0)</span>
            <span>Más creativo (2)</span>
          </div>
        </div>

        {/* Modo de Sampling */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modo de Sampling
          </label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setSamplingMode('top-p')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                samplingMode === 'top-p'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top-P
            </button>
            <button
              type="button"
              onClick={() => setSamplingMode('top-k')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                samplingMode === 'top-k'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top-K
            </button>
          </div>
          <p className="text-xs text-gray-500">Solo uno puede estar activo</p>
        </div>

        {/* Top-P - Solo activo si está seleccionado */}
        <div className={samplingMode === 'top-k' ? 'opacity-50' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top-P: {localConfig.topP.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localConfig.topP}
            disabled={samplingMode === 'top-k'}
            onChange={(e) => {
              const value = Math.max(0, Math.min(1, parseFloat(e.target.value)))
              setLocalConfig(prev => ({ ...prev, topP: value }))
            }}
            className="w-full disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Más determinista (0)</span>
            <span>Más diverso (1)</span>
          </div>
        </div>

        {/* Top-K - Solo activo si está seleccionado */}
        <div className={samplingMode === 'top-p' ? 'opacity-50' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top-K
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="1"
            value={localConfig.topK}
            disabled={samplingMode === 'top-p'}
            onChange={(e) => {
              const value = Math.max(0, Math.min(20, parseInt(e.target.value) || 0))
              setLocalConfig(prev => ({ ...prev, topK: value }))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
            placeholder="0-20"
          />
          <p className="text-xs text-gray-500 mt-1">Número de tokens candidatos (0-20, 0=desactivado)</p>
        </div>

        {/* Reasoning Effort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Esfuerzo de Razonamiento
          </label>
          <select
            value={localConfig.reasoningEffort}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, reasoningEffort: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {REASONING_EFFORT_OPTIONS.map(option => (
              <option key={option.id} value={option.id} title={option.description}>
                {option.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {REASONING_EFFORT_OPTIONS.find(opt => opt.id === localConfig.reasoningEffort)?.description}
          </p>
        </div>

        {/* Máximo de tokens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Máximo de tokens
          </label>
          <input
            type="number"
            min="100"
            max="4000"
            step="100"
            value={localConfig.maxTokens}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Endpoint API - Línea completa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Endpoint API
        </label>
        <input
          type="url"
          value={localConfig.apiEndpoint}
          onChange={(e) => setLocalConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="http://localhost:4000/api/completion"
        />
      </div>

      {/* Prompt del sistema */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prompt del sistema
        </label>
        <textarea
          value={localConfig.systemPrompt}
          onChange={(e) => setLocalConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Define cómo debe comportarse el asistente..."
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          🔄 Restablecer
        </button>
        <div className="flex gap-2">
          <button
            onClick={onToggleVisibility}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
