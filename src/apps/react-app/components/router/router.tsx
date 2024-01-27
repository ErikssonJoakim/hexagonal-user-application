import type { FC } from 'react'
import { appRoutes } from 'React-App/routes'
import { Routes, Route } from 'react-router-dom'

export const Router: FC = () => (
  <Routes>
    {appRoutes.map(({ id, path, element }) => (
      <Route element={element} key={id} path={path} />
    ))}
  </Routes>
)
