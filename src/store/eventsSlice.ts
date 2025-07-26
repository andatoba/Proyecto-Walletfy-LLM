import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { Event, CreateEvent, UpdateEvent } from '../types/event'
import { sampleEvents } from '../data/sampleEvents'
import { v4 as uuidv4 } from 'uuid'

interface EventsState {
  events: Event[]
  loading: boolean
  error: string | null
}

const getStoredEvents = (): Event[] => {
  const storedEvents = localStorage.getItem('walletfy-events')
  if (storedEvents) {
    return JSON.parse(storedEvents)
  }
  
  // Si no hay eventos almacenados, usar eventos de ejemplo
  localStorage.setItem('walletfy-events', JSON.stringify(sampleEvents))
  return sampleEvents
}

const saveEventsToStorage = (events: Event[]) => {
  localStorage.setItem('walletfy-events', JSON.stringify(events))
}

const initialState: EventsState = {
  events: getStoredEvents(),
  loading: false,
  error: null,
}

// Async thunks for event operations
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: CreateEvent) => {
    const newEvent: Event = {
      ...eventData,
      id: uuidv4(),
    }
    return newEvent
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (eventData: UpdateEvent) => {
    return eventData
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId: string) => {
    return eventId
  }
)

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload
      saveEventsToStorage(state.events)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
        saveEventsToStorage(state.events)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error creating event'
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...action.payload }
          saveEventsToStorage(state.events)
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error updating event'
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter(event => event.id !== action.payload)
        saveEventsToStorage(state.events)
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error deleting event'
      })
  },
})

export const { setEvents, clearError } = eventsSlice.actions
export default eventsSlice.reducer
