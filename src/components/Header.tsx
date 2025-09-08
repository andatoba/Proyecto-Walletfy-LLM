import { MessageCircle, Moon, Plus, RotateCcw, Sun } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setInitialBalance, toggleTheme } from '../store/appSlice'
import { setEvents } from '../store/eventsSlice'
import { sampleEvents } from '../data/sampleEvents'

export default function Header() {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector((state) => state.app)

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear todos los datos a los ejemplos iniciales?')) {
      // Resetear eventos
      dispatch(setEvents(sampleEvents))
      // Resetear balance inicial
      dispatch(setInitialBalance(3000))
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Walletfy 2
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Add Event Button */}
            <Link
              to="/form/$id"
              params={{ id: 'new' }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Link>

            {/* Chat Assistant Button */}
            <Link
              to="/chat"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat IA
            </Link>

            {/* Reset Data Button */}
            <button
              onClick={handleResetData}
              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
              title="Resetear a datos de ejemplo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
