import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from '@/apps/graphql/schema/typeDefs.generated'
import { resolvers } from '@/apps/graphql/schema/resolvers.generated'
import { MysqlUserRepositoryAdaptor } from '@/infra/mysql/user.mysql.repository.adapter'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import { RegisterUserUseCase } from '@/application/usecases/register-user.usecase'
import { RealIdProvider } from '@/infra/real-id-provider'
import { RealDateProvider } from '@/infra/real-date-provider'
import type { ID } from '@/types/super-types'
import type { User } from '@/domain/user'
import * as mysql from 'mysql2/promise'
import { config } from '@/lib/config'
import type { NetworkError } from '@/shared/errors/network'
import type { SerializationError } from '@/shared/errors/serialization'
import type { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import type { LoginUserCommand } from '@/application/usecases/login-user.usecase'
import { LoginUserUseCase } from '@/application/usecases/login-user.usecase'

const {
  node,
  dataSource: {
    mysql: { host, port, user, database, password },
    graphql
  }
} = config

const mysqlPoolOptions = {
  host,
  port: Number(port),
  user,
  database,
  password,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

const realIdProvider = new RealIdProvider()
const realDateProvider = new RealDateProvider()

const mysqlRepository = new MysqlUserRepositoryAdaptor(mysql.createPool(mysqlPoolOptions))
const loginUserUseCase = new LoginUserUseCase(mysqlRepository)

const registerUserUseCase = new RegisterUserUseCase(
  mysqlRepository,
  realIdProvider,
  realDateProvider
)

type UserAPI = {
  register: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<ID | NetworkError | ResourceAlreadyExistsError>
  login: (
    loginUserCommand: LoginUserCommand
  ) => Promise<User | SerializationError | ResourceNotFoundError | NetworkError>
  getByID: (id: ID) => Promise<User | NetworkError | SerializationError | ResourceNotFoundError>
}

export type Context = {
  dataSources: {
    userAPI: UserAPI
  }
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  nodeEnv: node?.env
})

const main = async (): Promise<void> => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(graphql.port) },
    context: async () => ({
      dataSources: {
        userAPI: {
          register: registerUserUseCase.handle.bind(registerUserUseCase),
          login: loginUserUseCase.handle.bind(loginUserUseCase),
          getByID: mysqlRepository.getByID.bind(mysqlRepository)
        }
      }
    })
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main()
