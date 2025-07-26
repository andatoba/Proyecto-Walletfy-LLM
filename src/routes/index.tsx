import { createFileRoute } from '@tanstack/react-router'
import BalanceFlow from '../components/BalanceFlow'

export const Route = createFileRoute('/')({
  component: () => <BalanceFlow />,
})
