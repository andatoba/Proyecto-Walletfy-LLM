import moment from 'moment'
import type { Event, MonthlyBalance } from '../types/event'

// Configure moment to use Spanish locale
moment.locale('es')

export const formatDate = (date: string | Date): string => {
  return moment(date).format('DD/MM/YYYY')
}

export const formatMonthYear = (date: string | Date): string => {
  return moment(date).format('MMMM YYYY')
}

export const getMonthKey = (date: string | Date): string => {
  return moment(date).format('YYYY-MM')
}

export const groupEventsByMonth = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((groups, event) => {
    const monthKey = getMonthKey(event.date)
    if (!groups[monthKey]) {
      groups[monthKey] = []
    }
    groups[monthKey].push(event)
    return groups
  }, {} as Record<string, Event[]>)
}

export const calculateMonthlyBalances = (events: Event[], initialBalance: number): MonthlyBalance[] => {
  const groupedEvents = groupEventsByMonth(events)
  const sortedMonths = Object.keys(groupedEvents).sort()
  
  let cumulativeBalance = initialBalance
  
  return sortedMonths.map((monthKey) => {
    const monthEvents = groupedEvents[monthKey]
    const totalIncome = monthEvents
      .filter(event => event.type === 'ingreso')
      .reduce((sum, event) => sum + event.amount, 0)
    
    const totalExpenses = monthEvents
      .filter(event => event.type === 'egreso')
      .reduce((sum, event) => sum + event.amount, 0)
    
    const monthlyBalance = totalIncome - totalExpenses
    cumulativeBalance += monthlyBalance
    
    return {
      month: monthKey,
      monthName: formatMonthYear(monthKey + '-01'),
      events: monthEvents.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()),
      totalIncome,
      totalExpenses,
      monthlyBalance,
      globalBalance: cumulativeBalance,
    }
  })
}

export const searchEventsByMonth = (balances: MonthlyBalance[], searchTerm: string): MonthlyBalance[] => {
  if (!searchTerm.trim()) return balances
  
  const normalizedSearch = searchTerm.toLowerCase().trim()
  
  return balances.filter(balance => 
    balance.monthName.toLowerCase().includes(normalizedSearch)
  )
}

// Utility to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
