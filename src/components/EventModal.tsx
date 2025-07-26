import { X, Calendar, DollarSign, FileText, Image as ImageIcon } from 'lucide-react'
import type { Event } from '../types/event'
import { formatDate } from '../utils/balanceCalculations'

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Detalles del Evento
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {event.name}
            </h4>
            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
              event.type === 'ingreso'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(event.date)}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cantidad
              </p>
              <p className={`text-lg font-bold ${
                event.type === 'ingreso'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {event.type === 'ingreso' ? '+' : '-'}${event.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Attachment */}
          {event.attachment && (
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adjunto
                </p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={event.attachment}
                    alt="Adjunto del evento"
                    className="w-full h-auto max-h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventModal
