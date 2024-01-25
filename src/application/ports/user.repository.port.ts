import type { Email } from "@/types/super-types";
import type { User } from "@/domain/user";
import type { NetworkError } from "@/application/errors/network";
import type {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from "@/application/errors/resource";

export abstract class UserRepositoryPort {
  abstract create(
    user: User
  ): Promise<void | NetworkError | ResourceAlreadyExistsError>;
  abstract getByEmail(
    userEmail: Email
  ): Promise<User | NetworkError | ResourceNotFoundError>;
}
