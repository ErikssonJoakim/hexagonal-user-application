import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'Design-System/ui/atoms/button/button'

export const LoginForm: FC = () => {
  const navigate = useNavigate()

  const handleRouting = useCallback(() => {
    navigate('/registration')
  }, [navigate])

  return (
    <div className="react-app-login-form-main">
      <Button
        className="react-app-login-form-registration-button"
        label="Register new user"
        onClick={handleRouting}
      />
    </div>
  )
}
