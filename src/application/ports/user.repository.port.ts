import type { ID } from '@/types/super-types'
import type { User } from '@/domain/user'
import type { NetworkError } from '@/shared/errors/network'
import type { SerializationError } from '@/shared/errors/serialization'
import type { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/errors/resource'
import type { LoginUserCommand } from '@/application/usecases/login-user.usecase'

export abstract class UserRepositoryPort {
  abstract create(user: User): Promise<ID | NetworkError | ResourceAlreadyExistsError>
  abstract login(
    loginCredentials: LoginUserCommand
  ): Promise<User | NetworkError | ResourceNotFoundError | SerializationError>
  abstract getByID(
    id: ID
  ): Promise<User | NetworkError | SerializationError | ResourceNotFoundError>
}
