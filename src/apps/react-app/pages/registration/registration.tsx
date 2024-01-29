import type { FC } from 'react'
import { useCallback, useContext } from 'react'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import type { FormikHelpers, FormikErrors } from 'formik'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { UserEmail, UserFirstName, UserLastName, UserPassword } from '@/domain/user'
import { isValidationNotConformError } from '@/shared/errors/validation'
import { UserContext } from '../../contexts/user.context'

type RegistrationInput = RegisterUserCommand

type RegistrationSubmitHandler = (
  input: RegistrationInput,
  helpers: FormikHelpers<RegistrationInput>
) => Promise<void>

type RegistrationValidation = (input: RegistrationInput) => FormikErrors<RegistrationInput>

// eslint-disable-next-line max-lines-per-function
export const Registration: FC = () => {
  const initialValues: RegistrationInput = { email: '', firstName: '', lastName: '', password: '' }
  const userContext = useContext(UserContext)

  const handleValidation: RegistrationValidation = useCallback(
    ({ email, firstName, lastName, password }) => {
      const inputErrors: FormikErrors<RegistrationInput> = {}

      try {
        UserEmail.of(email)
      } catch (error) {
        if (isValidationNotConformError(error)) inputErrors.email = error.ruleMessages[0]
      }

      try {
        UserFirstName.of(firstName)
      } catch (error) {
        if (isValidationNotConformError(error)) inputErrors.firstName = error.ruleMessages[0]
      }

      try {
        UserLastName.of(lastName)
      } catch (error) {
        if (isValidationNotConformError(error)) inputErrors.lastName = error.ruleMessages[0]
      }

      try {
        UserPassword.of(password)
      } catch (error) {
        if (isValidationNotConformError(error)) inputErrors.password = error.ruleMessages[0]
      }

      return inputErrors
    },
    []
  )

  const handleSubmit: RegistrationSubmitHandler = useCallback(
    async input => {
      userContext.register(input)
    },
    [userContext]
  )

  return (
    <div className="react-app-registration-page-main">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={handleValidation}
        validateOnChange
      >
        <Form className="react-app-registration-page-form">
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" placeholder="alice@martin.com" type="email" />
          <ErrorMessage name="email" />

          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="Alice" />
          <ErrorMessage name="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Martin" />
          <ErrorMessage name="lastName" />

          <label htmlFor="password">Password</label>
          <Field id="password" name="password" type="password" />
          <ErrorMessage name="password" />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  )
}
