import { SerializationError } from '@/shared/errors/serialization'
import { ResourceNotFoundError } from '@/shared/errors/resource'
import { ResourceAlreadyExistsError } from '@/shared/errors/resource'
import type { UserRepositoryPort } from '@/application/ports/user.repository.port'
import { User } from '@/domain/user'
import type { ID } from '@/types/super-types'
import type { LoginUserCommand } from '@/application/usecases/login-user.usecase'

export type InMemoryUser = {
  user_id: string
  email: string
  first_name: string
  last_name: string
  password: string
  created_at: Date
  updated_at?: Date
}

export class UserInMemoryRepository implements UserRepositoryPort {
  users: Map<string, InMemoryUser> = new Map()

  async login({
    email,
    password
  }: LoginUserCommand): Promise<User | ResourceNotFoundError | SerializationError> {
    return new Promise<User | SerializationError | ResourceNotFoundError>(resolve => {
      const repositoryResponse = [...this.users.values()].find(
        repositoryUser => repositoryUser.email === email && repositoryUser.password === password
      )

      // TODO: refactor boilerplate code
      if (repositoryResponse) {
        const { user_id, email, first_name, last_name, password, created_at, updated_at } =
          repositoryResponse

        try {
          const user: User = User.fromData({
            id: user_id,
            email,
            firstName: first_name,
            lastName: last_name,
            password,
            createdAt: created_at,
            updatedAt: updated_at
          })

          resolve(user)
        } catch (error) {
          resolve(SerializationError('User serialization from <in memory repository> unsuccessful'))
        }
      } else {
        resolve(ResourceNotFoundError([email]))
      }
    })
  }

  async create({
    id,
    email,
    firstName,
    lastName,
    password,
    createdAt,
    updatedAt
  }: User): Promise<ID | ResourceAlreadyExistsError> {
    const repositoryResponse = [...this.users.values()].find(
      repositoryUser => repositoryUser.email === email
    )

    if (repositoryResponse) return ResourceAlreadyExistsError([email])

    const repositoryUser: InMemoryUser = {
      user_id: id,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      created_at: createdAt,
      updated_at: updatedAt
    }

    this.users.set(repositoryUser.user_id, repositoryUser)
    return repositoryUser.user_id
  }

  async getByID(id: ID): Promise<User | SerializationError | ResourceNotFoundError> {
    return new Promise<User | SerializationError | ResourceNotFoundError>(resolve => {
      const repositoryUser = this.users.get(id)

      if (repositoryUser) {
        const { user_id, email, first_name, last_name, password, created_at, updated_at } =
          repositoryUser

        try {
          const user: User = User.fromData({
            id: user_id,
            email,
            firstName: first_name,
            lastName: last_name,
            password,
            createdAt: created_at,
            updatedAt: updated_at
          })

          resolve(user)
        } catch (error) {
          resolve(SerializationError('User serialization from <in memory repository> unsuccessful'))
        }
      } else {
        resolve(ResourceNotFoundError([id]))
      }
    })
  }
}
