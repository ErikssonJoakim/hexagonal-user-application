import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from '@/apps/graphql/schema/typeDefs.generated'
import { resolvers } from '@/apps/graphql/schema/resolvers.generated'
import { MysqlUserRepositoryAdaptor } from '@/infra/mysql/user.mysql.repository.adaptor'
import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'
import { RegisterUserUseCase } from '@/application/usecases/register-user.usecase'
import { DummyIdProvider } from '@/infra/dummy-id-provider'
import { RealDateProvider } from '@/infra/real-date-provider'
import type { ID } from '@/types/super-types'
import type { User } from '@/domain/user'
import * as mysql from 'mysql2/promise'
import { config } from '@/lib/config'
import type { NetworkError } from '@/application/errors/network'
import type { SerializationError } from '@/application/errors/serialization'
import type {
  ResourceAlreadyExistsError,
  ResourceNotFoundError
} from '@/application/errors/resource'

const {
  node: { env },
  dataSource: {
    mysql: { host, port, user, database, password }
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

const dummyIdProvider = new DummyIdProvider()
const realDateProvider = new RealDateProvider()

const mysqlRepository = new MysqlUserRepositoryAdaptor(mysql.createPool(mysqlPoolOptions))

const registerUserUseCase = new RegisterUserUseCase(
  mysqlRepository,
  dummyIdProvider,
  realDateProvider
)

type UserAPI = {
  register: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<ID | NetworkError | ResourceAlreadyExistsError>
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
  nodeEnv: env
})

const main = async (): Promise<void> => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({
      dataSources: {
        userAPI: {
          register: registerUserUseCase.handle.bind(registerUserUseCase),
          getByID: mysqlRepository.getByID.bind(mysqlRepository)
        }
      }
    })
  })

  console.log(`🚀  Server ready at: ${url}`)
}

main()
