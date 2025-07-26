import { z } from 'zod'

export const EventTypeEnum = z.enum(['ingreso', 'egreso'])
export type EventType = z.infer<typeof EventTypeEnum>

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es obligatorio').max(20, 'El nombre debe tener máximo 20 caracteres'),
  description: z.string().max(100, 'La descripción debe tener máximo 100 caracteres').optional(),
  amount: z.number().positive('La cantidad debe ser un número positivo'),
  date: z.string().datetime('Debe ser una fecha válida'),
  type: EventTypeEnum,
  attachment: z.string().optional(), // Base64 encoded image
})

export type Event = z.infer<typeof EventSchema>

export const CreateEventSchema = EventSchema.omit({ id: true })
export type CreateEvent = z.infer<typeof CreateEventSchema>

export const UpdateEventSchema = EventSchema.partial().extend({
  id: z.string().uuid(),
})
export type UpdateEvent = z.infer<typeof UpdateEventSchema>

// Helper type for monthly calculations
export interface MonthlyBalance {
  month: string // Format: "YYYY-MM"
  monthName: string // Format: "December 2024"
  events: Event[]
  totalIncome: number
  totalExpenses: number
  monthlyBalance: number
  globalBalance: number
}

// Theme types
export type Theme = 'light' | 'dark'

// App state interface
export interface AppState {
  initialBalance: number
  theme: Theme
}
