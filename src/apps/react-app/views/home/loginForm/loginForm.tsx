import type { FC } from 'react'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'Design-System/ui/atoms/button/button'
import type { FormikHelpers, FormikErrors } from 'formik'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { User, UserEmail } from '@/domain/user'
import { isValidationNotConformError } from '@/shared/errors/validation'
import { UserContext } from 'React-App/contexts/user.context'
import type { LoginUserCommand } from '@/application/usecases/login-user.usecase'
import './loginForm.scss'

type LoginCredentials = LoginUserCommand

type LoginSubmitHandler = (
  input: LoginCredentials,
  helpers: FormikHelpers<LoginCredentials>
) => Promise<void>

type LoginValidationInput = Pick<LoginCredentials, 'email'>
type LoginValidation = (input: LoginValidationInput) => FormikErrors<LoginCredentials>

// eslint-disable-next-line max-lines-per-function
export const LoginForm: FC = () => {
  const navigate = useNavigate()

  const handleRouting = useCallback(() => {
    navigate('/registration')
  }, [navigate])

  const initialValues: LoginCredentials = { email: '', password: '' }
  const userContext = useContext(UserContext)

  const handleValidation: LoginValidation = useCallback(({ email }) => {
    const inputErrors: FormikErrors<LoginValidationInput> = {}

    try {
      UserEmail.of(email)
    } catch (error) {
      if (isValidationNotConformError(error)) inputErrors.email = error.ruleMessages[0]
    }

    return inputErrors
  }, [])

  const handleSubmit: LoginSubmitHandler = useCallback(
    async (input, { setStatus }) => {
      const loginResponse = await userContext.login(input)

      if (User.isUser(loginResponse)) {
        userContext.setUser(loginResponse)
      } else {
        switch (loginResponse._tag) {
          case 'network-http':
          case 'network-unspecified':
            setStatus("We're having network issues, please try again later")
            break
          case 'resource-not-found':
            setStatus('Login incorrect')
            break
          case 'serialization':
            setStatus("We're unable to treat your login request. Please contact us")
        }
      }
    },
    [userContext]
  )

  return (
    <div className="react-app-login-form-main">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={handleValidation}
        validateOnChange
      >
        {({ status }) => (
          <Form className="react-app-login-page-form">
            {status && <p className="react-app-login-page-form-status">{status}</p>}

            <label htmlFor="email">Email</label>
            <Field id="email" name="email" placeholder="alice@martin.com" type="email" />
            <ErrorMessage name="email" />

            <label htmlFor="password">Password</label>
            <Field id="password" name="password" type="password" />
            <ErrorMessage name="password" />
            <Button
              className="react-app-login-form-registration-button"
              label="Register new user"
              onClick={handleRouting}
            />
            <button type="submit">Login</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
