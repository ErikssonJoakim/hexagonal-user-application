import type { FC } from 'react'
import { useContext } from 'react'
import { Router } from 'React-App/components/router/router'
import { UserContext } from 'React-App/contexts/user.context'

const App: FC = () => {
  const context = useContext(UserContext)

  return (
    <div style={{ height: 'inherit' }}>
      <div className="react-app-page-layout">
        <UserContext.Provider value={context}>
          <Router />
        </UserContext.Provider>
      </div>
    </div>
  )
}

export default App
