import { createContext } from 'react'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import { RegisterUserUseCase } from '@/application/usecases/register-user.usecase'
import { RealIdProvider } from '@/infra/real-id-provider'
import { RealDateProvider } from '@/infra/real-date-provider'
import { ApolloUserRepositoryAdaptor } from '@/infra/apollo/user.apollo.api.adapter'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { ID } from '@/types/super-types'
import type { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import type { NetworkError } from '@/shared/errors/network'
import type { SerializationError } from '@/shared/errors/serialization'
import type { User } from '@/domain/user'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/',

  name: 'react-app-client',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
})

const realIdProvider = new RealIdProvider()
const realDateProvider = new RealDateProvider()
const apolloAPI = new ApolloUserRepositoryAdaptor(client)

const registerUserUseCase = new RegisterUserUseCase(apolloAPI, realIdProvider, realDateProvider)

type UserContext = {
  register: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<ID | NetworkError | ResourceAlreadyExistsError>
  getByID: (id: ID) => Promise<User | NetworkError | SerializationError | ResourceNotFoundError>
  user?: User
}

export const UserContext = createContext<UserContext>({
  register: registerUserUseCase.handle.bind(registerUserUseCase),
  getByID: apolloAPI.getByID.bind(apolloAPI)
})
