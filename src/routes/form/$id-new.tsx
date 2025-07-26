import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form/$id-new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/form/$id-new"!</div>
}
