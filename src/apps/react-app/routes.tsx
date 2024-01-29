import { Registration } from 'React-App/pages/registration/registration'
import { Home } from 'React-App/pages/home/home'

export enum routes {
  home = '/',
  registration = '/registration'
}

export type Route = {
  id: string
  path: string
  element: React.ReactNode
}

export const appRoutes: Route[] = [
  {
    id: 'home',
    path: routes.home,
    element: <Home />
  },
  {
    id: 'registration',
    path: routes.registration,
    element: <Registration />
  }
]
