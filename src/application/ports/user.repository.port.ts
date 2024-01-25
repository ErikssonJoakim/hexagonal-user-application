import type { Email } from "@/types/super-types";
import type { User } from "@/domain/user";
import type {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from "@/application/errors/resource";

export abstract class UserRepositoryPort {
  abstract create(user: User): Promise<void | ResourceAlreadyExistsError>;
  abstract getByEmail(userEmail: Email): Promise<User | ResourceNotFoundError>;
}
