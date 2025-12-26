import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Upload, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createEvent, updateEvent } from '../store/eventsSlice'
import { fileToBase64 } from '../utils/balanceCalculations'

const EventForm = () => {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false })
  const dispatch = useAppDispatch()
  const { events } = useAppSelector((state) => state.events)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  const isEditing = Boolean(id && id !== 'new')
  const existingEvent = isEditing ? events.find(event => event.id === id) : null

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    date: '',
    type: 'ingreso' as 'ingreso' | 'egreso',
    attachment: ''
  })

  // Initialize form data
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name,
        description: existingEvent.description || '',
        amount: existingEvent.amount,
        date: new Date(existingEvent.date).toISOString().slice(0, 16),
        type: existingEvent.type,
        attachment: existingEvent.attachment || ''
      })
      if (existingEvent.attachment) {
        setPreviewUrl(existingEvent.attachment)
      }
    }
  }, [existingEvent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Basic validation
      if (!formData.name.trim()) {
        alert('El nombre es obligatorio')
        return
      }
      if (formData.name.length > 20) {
        alert('El nombre debe tener máximo 20 caracteres')
        return
      }
      if (formData.description && formData.description.length > 100) {
        alert('La descripción debe tener máximo 100 caracteres')
        return
      }
      if (formData.amount <= 0) {
        alert('La cantidad debe ser un número positivo')
        return
      }
      if (!formData.date) {
        alert('La fecha es obligatoria')
        return
      }

      let attachment = formData.attachment

      if (selectedFile) {
        attachment = await fileToBase64(selectedFile)
      }

      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        attachment,
      }

      if (isEditing && existingEvent) {
        await dispatch(updateEvent({
          ...eventData,
          id: existingEvent.id,
        }))
      } else {
        await dispatch(createEvent(eventData))
      }

      navigate({ to: '/' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      alert('Error al guardar el evento: ' + message)
    }
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(existingEvent?.attachment || '')
    }
  }

  const removeAttachment = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setFormData(prev => ({ ...prev, attachment: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del evento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ingrese el nombre del evento"
                maxLength={20}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.name.length}/20 caracteres
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Descripción opcional del evento"
                rows={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/100 caracteres
              </p>
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha y hora <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de evento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'ingreso' | 'egreso' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adjunto (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Seleccionar archivo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                {isEditing ? 'Actualizar' : 'Crear'} Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventForm
