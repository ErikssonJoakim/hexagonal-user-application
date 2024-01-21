import type { UserRepositoryPort } from "@/application/ports/user.repository.port";
import type { User } from "@/domain/user";

export class UserInMemoryRepository implements UserRepositoryPort {
  users: Map<string, User> = new Map();

  async create(user: User): Promise<void> {
    this.users.set(user.email, user);
  }

  async getByEmail(userEmail: string): Promise<User | null> {
    return this.users.get(userEmail) ?? null;
  }
}
