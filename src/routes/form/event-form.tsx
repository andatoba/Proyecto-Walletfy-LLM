import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form/event-form')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/form/event-form"!</div>
}
