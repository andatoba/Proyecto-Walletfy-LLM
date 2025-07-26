import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppState } from '../types/event'

const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('walletfy-theme')
  return (savedTheme as 'light' | 'dark') || 'light'
}

const getInitialBalance = (): number => {
  const savedBalance = localStorage.getItem('walletfy-initial-balance')
  if (savedBalance) {
    return parseFloat(savedBalance)
  }
  
  // Balance inicial de ejemplo
  const exampleBalance = 3000
  localStorage.setItem('walletfy-initial-balance', exampleBalance.toString())
  return exampleBalance
}

const initialState: AppState = {
  initialBalance: getInitialBalance(),
  theme: getInitialTheme(),
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialBalance: (state, action: PayloadAction<number>) => {
      state.initialBalance = action.payload
      localStorage.setItem('walletfy-initial-balance', action.payload.toString())
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('walletfy-theme', state.theme)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('walletfy-theme', action.payload)
    }
  },
})

export const { setInitialBalance, toggleTheme, setTheme } = appSlice.actions
export default appSlice.reducer
