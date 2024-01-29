import type { FC } from 'react'
import { useContext } from 'react'
import { UserContext } from 'React-App/contexts/user.context'
import { LoginForm } from 'React-App/views/home/loginForm/loginForm'

export const Home: FC = () => {
  const { user } = useContext(UserContext)

  return (
    <div className="react-app-home-page-main">
      {user ? (
        <>
          <p>
            Welcome {user.firstName}, {user.lastName}
          </p>
          <p>You logged in with email: {user.email}</p>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
