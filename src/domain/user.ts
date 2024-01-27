import type { Email, ID, Password } from '@/types/super-types'

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
    private readonly _email: Email,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _password: Password,
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
  }: User['data']): User {
    return new User(id, email, firstName, lastName, password, createdAt, updatedAt)
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
    return this._email
  }

  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get password(): string {
    return this._password
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
