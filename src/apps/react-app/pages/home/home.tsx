import { Button } from '@/apps/design-system/ui/atoms/button/button'
import type { FC } from 'react'
import { useCallback, useContext } from 'react'
import { UserContext } from 'React-App/contexts/user.context'
import { LoginForm } from 'React-App/views/home/loginForm/loginForm'
import './home.scss'

export const Home: FC = () => {
  const { user, setUser } = useContext(UserContext)

  const handleLogout = useCallback(() => {
    setUser(null)
  }, [setUser])

  return (
    <div className="react-app-home-page-main">
      {user ? (
        <div className="react-app-home-page-logout-welcome">
          <p>
            Welcome {user.firstName}, {user.lastName}
          </p>
          <p>You logged in with email: {user.email}</p>
          <Button label="Logout" onClick={handleLogout} />
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
