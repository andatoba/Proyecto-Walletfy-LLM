import { useState } from 'react'
import { ChevronDown, ChevronUp, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { MonthlyBalance } from '../types/event'
import { formatDate } from '../utils/balanceCalculations'
import EventModal from './EventModal'
import { useAppDispatch } from '../store/hooks'
import { deleteEvent } from '../store/eventsSlice'

interface MonthCardProps {
  monthBalance: MonthlyBalance
}

const MonthCard = ({ monthBalance }: MonthCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleEditEvent = (eventId: string) => {
    navigate({ to: `/form/${eventId}` })
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      await dispatch(deleteEvent(eventId))
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
              {monthBalance.monthName}
            </h3>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          {/* Summary */}
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  ${monthBalance.totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Egresos</p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  ${monthBalance.totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance mensual:</span>
              </div>
              <span className={`font-bold ${
                monthBalance.monthlyBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                ${monthBalance.monthlyBalance.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Balance global:</span>
              <span className={`font-bold ${
                monthBalance.globalBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                ${monthBalance.globalBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Events List */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {monthBalance.events.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No hay eventos en este mes
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {monthBalance.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                      title={event.description || 'Sin descripción'}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded-full ${
                            event.type === 'ingreso' 
                              ? 'bg-green-100 dark:bg-green-900' 
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            {event.type === 'ingreso' ? (
                              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {event.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-medium ${
                            event.type === 'ingreso' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {event.type === 'ingreso' ? '+' : '-'}${event.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditEvent(event.id)
                        }}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                        title="Editar evento"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEvent(event.id)
                        }}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        title="Eliminar evento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
      />
    </>
  )
}

export default MonthCard
