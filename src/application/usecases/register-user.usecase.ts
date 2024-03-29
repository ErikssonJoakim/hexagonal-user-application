import type { Email, ID, Password } from '@/types/super-types'
import { User } from '@/domain/user'
import type { UserRepositoryPort } from '@/application/ports/user.repository.port'
import type { DateProviderPort } from '@/application/ports/date-provider.port'
import type { IdProviderPort } from '@/application/ports/id-provider.port'
import type { NetworkError } from '@/shared/errors/network'
import type { ResourceAlreadyExistsError } from '@/shared/errors/resource'

export type RegisterUserCommand = {
  email: Email
  firstName: string
  lastName: string
  password: Password
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly idProvider: IdProviderPort,
    private readonly dateProvider: DateProviderPort
  ) {}

  async handle({
    email,
    firstName,
    lastName,
    password
  }: RegisterUserCommand): Promise<ID | NetworkError | ResourceAlreadyExistsError> {
    return this.userRepository.create(
      User.fromData({
        id: this.idProvider.getId(),
        email,
        firstName,
        lastName,
        password,
        createdAt: this.dateProvider.getNow()
      })
    )
  }
}
