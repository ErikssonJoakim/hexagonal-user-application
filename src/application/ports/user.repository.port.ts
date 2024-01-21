import type { Email } from "@/types/super-types";
import type { User } from "@/domain/user";

export abstract class UserRepositoryPort {
  abstract create(user: User): Promise<void>;
  abstract getByEmail(userEmail: Email): Promise<User | null>;
}
