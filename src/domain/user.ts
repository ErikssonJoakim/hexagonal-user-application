import { ValidationNotConformError } from '@/shared/errors/validation'
import type { Email, ID, Password } from '@/types/super-types'
import { stringValidatorBuilder } from '@/utils/string/string-validator.builder'

export class UserEmail {
  private constructor(readonly value: string) {}

  static of(email: string): UserEmail | never {
    const validateEmail = stringValidatorBuilder()
      .notEmpty([true, 'Required'])
      .pattern([
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        'Must conform to email format Alice@email.com'
      ])
      .build()

    const emailValidationMessages = validateEmail(email)
    if (emailValidationMessages.length !== 0)
      throw ValidationNotConformError(emailValidationMessages)

    return new UserEmail(email)
  }
}

export class UserFirstName {
  private constructor(readonly value: string) {}

  static of(firstName: string): UserFirstName | never {
    const validateName = stringValidatorBuilder()
      .notEmpty([true, 'Required'])
      .min([2, 'Firstname too short'])
      .max([50, 'Firstname too long'])
      .specialCharacters({ acceptedCharacters: new RegExp('') })
      .build()

    const emailValidationMessages = validateName(firstName)
    if (emailValidationMessages.length !== 0)
      throw ValidationNotConformError(emailValidationMessages)

    return new UserFirstName(firstName)
  }
}

export class UserLastName {
  private constructor(readonly value: string) {}

  static of(lastName: string): UserLastName | never {
    const validateName = stringValidatorBuilder()
      .notEmpty([true, 'Required'])
      .min([2, 'LastName too short'])
      .max([50, 'LastName too long'])
      .specialCharacters({ acceptedCharacters: new RegExp('') })
      .build()

    const emailValidationMessages = validateName(lastName)
    if (emailValidationMessages.length !== 0)
      throw ValidationNotConformError(emailValidationMessages)

    return new UserLastName(lastName)
  }
}

export class UserPassword {
  private constructor(readonly value: string) {}

  static of(password: string): UserPassword | never {
    const validatePassword = stringValidatorBuilder()
      .notEmpty([true, 'Required'])
      .min([8, 'Must be atleast 8 characters long'])
      .max([60, 'Cannot be more than 60 characters long'])
      .lowerCases({
        acceptedCharacters: new RegExp('a-z'),
        min: [1, 'Must have atleast 1 lower case character']
      })
      .upperCases({
        acceptedCharacters: new RegExp('A-Z'),
        min: [1, 'Must have atleast 1 upper case character']
      })
      .digits({ acceptedCharacters: new RegExp('0-9'), min: [1, 'Must have atleast 1 digit'] })
      .specialCharacters({
        acceptedCharacters: new RegExp(`/\\/#,@_!{}()\\[\\]:;.|$=\\-+?&~%"'/`),
        min: [1, 'Must have atleast 1 special character']
      })
      .build()

    const passwordValidationMessages = validatePassword(password)
    if (passwordValidationMessages.length !== 0)
      throw ValidationNotConformError(passwordValidationMessages)

    return new UserPassword(password)
  }
}

type UserData = {
  id: ID
  email: Email
  firstName: string
  lastName: string
  password: Password
  createdAt: Date
  updatedAt?: Date
}

export class User {
  constructor(
    private readonly _id: ID,
    private readonly _email: UserEmail,
    private readonly _firstName: UserFirstName,
    private readonly _lastName: UserLastName,
    private readonly _password: UserPassword,
    private readonly _createdAt: Date,
    private readonly _updatedAt?: Date
  ) {}

  static fromData({
    id,
    email,
    firstName,
    lastName,
    password,
    createdAt,
    updatedAt
  }: User['data']): User | never {
    return new User(
      id,
      UserEmail.of(email),
      UserFirstName.of(firstName),
      UserLastName.of(lastName),
      UserPassword.of(password),
      createdAt,
      updatedAt
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isUser(value: any): value is User {
    return (
      !!value.id &&
      !!value.email &&
      !!value.firstName &&
      !!value.lastName &&
      !!value.password &&
      !!value.createdAt
    )
  }

  get id(): ID {
    return this._id
  }

  get email(): Email {
    return this._email.value
  }

  get firstName(): string {
    return this._firstName.value
  }

  get lastName(): string {
    return this._lastName.value
  }

  get password(): string {
    return this._password.value
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  get data(): UserData {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
