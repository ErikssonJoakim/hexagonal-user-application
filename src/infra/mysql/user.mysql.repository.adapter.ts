import type { UserRepositoryPort } from '@/application/ports/user.repository.port'
import type { ID } from '@/types/super-types'
import type * as mysql from 'mysql2/promise'
import { User } from '@/domain/user'
import type { NetworkError } from '@/shared/errors/network'
import { HTTPNetworkError, NetworkUnspecifiedError } from '@/shared/errors/network'
import { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import { SerializationError } from '@/shared/errors/serialization'

interface MysqlUser extends mysql.RowDataPacket {
  user_id: string
  email: string
  first_name: string
  last_name: string
  password: string
  created_at: Date
  updated_at: Date | null
}

const REGISTER_USER_QUERY =
  'INSERT INTO users(user_id, email, first_name, last_name, password, created_at) VALUES(?, ?, ?, ?, ?, ?);'

const GET_USER_BY_ID =
  'SELECT user_id, email, first_name, last_name, password, created_at, updated_at FROM users WHERE user_id = ?;'

export class MysqlUserRepositoryAdaptor implements UserRepositoryPort {
  constructor(private readonly pool: mysql.Pool) {}

  async create({
    id,
    email,
    firstName,
    lastName,
    password,
    createdAt
  }: User): Promise<ID | NetworkError | ResourceAlreadyExistsError> {
    return this.pool
      .execute<mysql.ResultSetHeader>(REGISTER_USER_QUERY, [
        id,
        email,
        firstName,
        lastName,
        password,
        createdAt
      ])
      .then(
        () => id,
        error => {
          switch (error.code) {
            case 'ER_DUP_ENTRY':
              return ResourceAlreadyExistsError([email])
            case 'ECONNREFUSED':
              return HTTPNetworkError({
                errorCode: 503,
                reason: 'database not available',
                rawMessage: error
              })
            default:
              return NetworkUnspecifiedError('an unspecified error occured while registering user')
          }
        }
      )
  }

  async getByID(id: ID): Promise<User | NetworkError | SerializationError | ResourceNotFoundError> {
    return this.pool.execute<MysqlUser[]>(GET_USER_BY_ID, [id]).then(
      ([rows]) => {
        if (rows.length === 0) return ResourceNotFoundError([id])

        try {
          const { user_id, email, first_name, last_name, password, created_at, updated_at } =
            rows[0]

          const user: User = User.fromData({
            id: user_id,
            email,
            firstName: first_name,
            lastName: last_name,
            password,
            createdAt: created_at,
            updatedAt: updated_at ?? undefined
          })

          return user
        } catch (error) {
          return SerializationError('user serialization from database unsuccessful')
        }
      },
      error => {
        if (error.code === 'ECONNREFUSED')
          return HTTPNetworkError({
            errorCode: 503,
            reason: 'database not available',
            rawMessage: error
          })

        return NetworkUnspecifiedError('an unspecified error occured while fetching user')
      }
    )
  }
}
