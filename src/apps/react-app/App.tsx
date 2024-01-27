import type { FC } from 'react'
import { Router } from 'React-App/components/router/router'

const App: FC = () => {
  return (
    <div style={{ height: 'inherit' }}>
      <div>
        <Router />
      </div>
    </div>
  )
}

export default App
