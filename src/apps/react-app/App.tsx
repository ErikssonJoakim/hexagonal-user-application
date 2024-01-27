import type { FC } from 'react'
import { Router } from 'React-App/components/router/router'

const App: FC = () => {
  return (
    <div style={{ height: 'inherit' }}>
      <div className="page-layout">
        <Router />
      </div>
    </div>
  )
}

export default App
