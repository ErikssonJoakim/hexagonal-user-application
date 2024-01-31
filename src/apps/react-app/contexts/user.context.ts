import { createContext } from 'react'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import type { ID } from '@/types/super-types'
import type { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import type { NetworkError } from '@/shared/errors/network'
import type { SerializationError } from '@/shared/errors/serialization'
import type { User } from '@/domain/user'

type UserContext = {
  register: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<ID | NetworkError | ResourceAlreadyExistsError>
  getByID: (id: ID) => Promise<User | NetworkError | SerializationError | ResourceNotFoundError>
  user?: User
}

export const UserContext = createContext<UserContext>({
  register: async () =>
    new Promise((_, reject) => {
      reject('register not set')
    }),
  getByID: async () =>
    new Promise((_, reject) => {
      reject('getByID not set')
    }),
  user: null
})
