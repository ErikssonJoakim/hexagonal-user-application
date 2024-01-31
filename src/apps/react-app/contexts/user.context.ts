import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import type { ID } from '@/types/super-types'
import type { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import type { NetworkError } from '@/shared/errors/network'
import type { SerializationError } from '@/shared/errors/serialization'
import type { User } from '@/domain/user'
import type { LoginUserCommand } from '@/application/usecases/login-user.usecase'

type UserContext = {
  register: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<ID | NetworkError | ResourceAlreadyExistsError>
  login: (
    loginUserCommand: LoginUserCommand
  ) => Promise<User | SerializationError | ResourceNotFoundError | NetworkError>
  getByID: (id: ID) => Promise<User | NetworkError | SerializationError | ResourceNotFoundError>
  setUser: Dispatch<SetStateAction<User | null>>
  user: User | null
}

export const UserContext = createContext<UserContext>({
  register: async () =>
    new Promise((_, reject) => {
      reject('register not set')
    }),
  login: async () =>
    new Promise((_, reject) => {
      reject('login not set')
    }),
  getByID: async () =>
    new Promise((_, reject) => {
      reject('getByID not set')
    }),
  setUser: async () =>
    new Promise((_, reject) => {
      reject('setUser not set')
    }),
  user: null
})
