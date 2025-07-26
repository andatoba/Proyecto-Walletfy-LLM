import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setInitialBalance } from '../store/appSlice'
import { calculateMonthlyBalances, searchEventsByMonth } from '../utils/balanceCalculations'
import { useSimpleDebounce } from '../hooks/simpleDebounce'

const BalanceFlow = () => {
  const dispatch = useAppDispatch()
  const { initialBalance } = useAppSelector((state) => state.app)
  const { events } = useAppSelector((state) => state.events)
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState(0)
  
  const debouncedSearchTerm = useSimpleDebounce(searchTerm, 300)

  const handleCalculateAdditionalBalance = () => {
    if (inputValue > 0) {
      // Suma el valor del input al balance inicial actual
      const newBalance = initialBalance + inputValue
      dispatch(setInitialBalance(newBalance))
      // Limpiar el input después de calcular
      setInputValue(0)
    }
  }
  
  const monthlyBalances = calculateMonthlyBalances(events, initialBalance)
  const filteredBalances = searchEventsByMonth(monthlyBalances, debouncedSearchTerm)
  
  return (
    <div className="space-y-6">
      {/* Initial Balance Input */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* Balance Inicial Actual (solo lectura) */}
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
              Balance Inicial Actual:
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-semibold">
              ${initialBalance.toFixed(2)}
            </div>
          </div>

          {/* Input para agregar dinero */}
          <div className="flex items-center gap-4">
            <label htmlFor="additional-money" className="text-lg font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
              Agregar dinero:
            </label>
            <input
              id="additional-money"
              type="number"
              min="0"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
            <button
              onClick={handleCalculateAdditionalBalance}
              disabled={inputValue <= 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Calcular
            </button>
          </div>

          {/* Información del balance global final */}
          {monthlyBalances.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Balance Global Final:
              </span>
              <span className="text-lg font-bold text-green-800 dark:text-green-200">
                ${monthlyBalances[monthlyBalances.length - 1]?.globalBalance.toFixed(2) || '0.00'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          You have {events.length} events in {monthlyBalances.length} months
        </h2>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar mes (ej: Diciembre 2024, Diciembre, etc.)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Monthly Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBalances.map((monthBalance) => (
          <div key={monthBalance.month} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {monthBalance.month}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Ingresos:</span>
                <span className="text-green-600 font-semibold">
                  +${monthBalance.totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Gastos:</span>
                <span className="text-red-600 font-semibold">
                  -${monthBalance.totalExpenses.toFixed(2)}
                </span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-800 dark:text-white">Balance Global:</span>
                <span className={`${monthBalance.globalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${monthBalance.globalBalance.toFixed(2)}
                </span>
              </div>
              
              {/* Lista de eventos */}
              <div className="mt-3 space-y-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Eventos ({monthBalance.events.length}):
                </div>
                {monthBalance.events.length > 0 ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {monthBalance.events.map((event) => (
                      <div key={event.id} className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="truncate flex-1 mr-2">{event.name}</span>
                        <span className={`font-medium ${event.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                          {event.type === 'ingreso' ? '+' : '-'}${event.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                    No hay eventos en este mes
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBalances.length === 0 && debouncedSearchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron meses que coincidan con "{debouncedSearchTerm}"
          </p>
        </div>
      )}

      {monthlyBalances.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No hay eventos registrados. ¡Crea tu primer evento!
          </p>
        </div>
      )}
    </div>
  )
}

export default BalanceFlow
