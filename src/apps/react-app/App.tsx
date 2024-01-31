import type { User } from '@/domain/user'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Router } from 'React-App/components/router/router'
import { UserContext } from 'React-App/contexts/user.context'
import { RegisterUserUseCase } from '@/application/usecases/register-user.usecase'
import { RealIdProvider } from '@/infra/real-id-provider'
import { RealDateProvider } from '@/infra/real-date-provider'
import { ApolloUserRepositoryAdaptor } from '@/infra/apollo/user.apollo.api.adapter'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { LoginUserUseCase } from '@/application/usecases/login-user.usecase'

const App: FC = () => {
  const cache = useMemo(() => new InMemoryCache(), [])

  const client = useMemo(
    () =>
      new ApolloClient({
        cache,
        uri: `http://localhost:4000/`,

        name: 'react-app-client',
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network'
          }
        }
      }),
    [cache]
  )

  const realIdProvider = useMemo(() => new RealIdProvider(), [])
  const realDateProvider = useMemo(() => new RealDateProvider(), [])
  const apolloAPI = useMemo(() => new ApolloUserRepositoryAdaptor(client), [client])
  const loginUserUseCase = useMemo(() => new LoginUserUseCase(apolloAPI), [apolloAPI])
  const registerUserUseCase = useMemo(
    () => new RegisterUserUseCase(apolloAPI, realIdProvider, realDateProvider),
    [apolloAPI, realDateProvider, realIdProvider]
  )

  const [user, setUser] = useState<User | null>(null)

  const context = {
    register: registerUserUseCase.handle.bind(registerUserUseCase),
    login: loginUserUseCase.handle.bind(loginUserUseCase),
    getByID: apolloAPI.getByID.bind(apolloAPI),
    setUser,
    user
  }

  return (
    <div style={{ height: 'inherit' }}>
      <div className="react-app-page-layout">
        <UserContext.Provider value={context}>
          <Router />
        </UserContext.Provider>
      </div>
    </div>
  )
}

export default App
