import type { ID } from "@/types/super-types";
import type { User } from "@/domain/user";
import type { NetworkError } from "@/application/errors/network";
import type { SerializationError } from "@/application/errors/serialization";
import type {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from "@/application/errors/resource";

export abstract class UserRepositoryPort {
  abstract create(
    user: User
  ): Promise<ID | NetworkError | ResourceAlreadyExistsError>;
  abstract getByID(
    id: ID
  ): Promise<User | NetworkError | SerializationError | ResourceNotFoundError>;
}
