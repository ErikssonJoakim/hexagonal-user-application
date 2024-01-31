import type { Email, Password } from '@/types/super-types'
import type { User } from '@/domain/user'
import type { UserRepositoryPort } from '@/application/ports/user.repository.port'
import type { NetworkError } from '@/shared/errors/network'
import type { ResourceNotFoundError } from '@/shared/errors/resource'
import type { SerializationError } from '@/shared/errors/serialization'

export type LoginUserCommand = {
  email: Email
  password: Password
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async handle(
    command: LoginUserCommand
  ): Promise<User | NetworkError | ResourceNotFoundError | SerializationError> {
    return this.userRepository.login(command)
  }
}
