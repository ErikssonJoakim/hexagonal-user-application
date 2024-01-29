import { Registration } from 'React-App/pages/registration/registration'

export enum routes {
  registration = '/registration'
}

export type Route = {
  id: string
  path: string
  element: React.ReactNode
}

export const appRoutes: Route[] = [
  {
    id: 'registration',
    path: routes.registration,
    element: <Registration />
  }
]
