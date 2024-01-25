import { ResourceNotFoundError } from "@/application/errors/resource";
import { ResourceAlreadyExistsError } from "@/application/errors/resource";
import type { UserRepositoryPort } from "@/application/ports/user.repository.port";
import type { User } from "@/domain/user";

export class UserInMemoryRepository implements UserRepositoryPort {
  users: Map<string, User> = new Map();

  async create(user: User): Promise<void | ResourceAlreadyExistsError> {
    const repositoryResponse = await this.getByEmail(user.email);

    if (User.isUser(repositoryResponse))
      return ResourceAlreadyExistsError([repositoryResponse.email]);

    this.users.set(user.email, user);
  }

  async getByEmail(userEmail: string): Promise<User | ResourceNotFoundError> {
    return new Promise<User | ResourceNotFoundError>((resolve) => {
      const repositoryUser = this.users.get(userEmail);

      if (repositoryUser) {
        resolve(repositoryUser);
      } else {
        resolve(ResourceNotFoundError(userEmail));
      }
    });
  }
}
