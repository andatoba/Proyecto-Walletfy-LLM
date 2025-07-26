import type { Event } from '../types/event'

// Eventos de ejemplo para demostrar la funcionalidad
export const sampleEvents: Event[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Salario Enero',
    description: 'Pago de salario mensual del trabajo principal',
    amount: 500,
    date: '2025-01-15T09:00:00.000Z',
    type: 'ingreso',
    attachment: undefined
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Supermercado',
    description: 'Compras mensuales en el supermercado familiar',
    amount: 80,
    date: '2025-01-20T14:30:00.000Z',
    type: 'egreso',
    attachment: undefined
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Freelance Web',
    description: 'Proyecto de desarrollo web para cliente local',
    amount: 120,
    date: '2025-01-25T16:00:00.000Z',
    type: 'ingreso',
    attachment: undefined
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Renta',
    description: 'Pago mensual del alquiler del departamento',
    amount: 150,
    date: '2025-02-01T10:00:00.000Z',
    type: 'egreso',
    attachment: undefined
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Venta Equipos',
    description: 'Venta de equipos de oficina usados',
    amount: 80,
    date: '2025-02-10T12:00:00.000Z',
    type: 'ingreso',
    attachment: undefined
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Gasolina',
    description: 'Combustible para el automóvil del mes',
    amount: 30,
    date: '2025-02-15T08:45:00.000Z',
    type: 'egreso',
    attachment: undefined
  }
]
