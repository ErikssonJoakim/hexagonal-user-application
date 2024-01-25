import { SerializationError } from "@/application/errors/serialization";
import { ResourceNotFoundError } from "@/application/errors/resource";
import { ResourceAlreadyExistsError } from "@/application/errors/resource";
import type { UserRepositoryPort } from "@/application/ports/user.repository.port";
import { User } from "@/domain/user";

export type InMemoryUser = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
};

export class UserInMemoryRepository implements UserRepositoryPort {
  users: Map<string, InMemoryUser> = new Map();

  async create({
    id,
    email,
    firstName,
    lastName,
    password,
    createdAt,
    updatedAt,
  }: User): Promise<void | ResourceAlreadyExistsError> {
    const repositoryResponse = await this.getByEmail(email);

    if (User.isUser(repositoryResponse))
      return ResourceAlreadyExistsError([repositoryResponse.email]);

    const repositoryUser: InMemoryUser = {
      user_id: id,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    this.users.set(email, repositoryUser);
  }

  async getByEmail(
    userEmail: string
  ): Promise<User | SerializationError | ResourceNotFoundError> {
    return new Promise<User | SerializationError | ResourceNotFoundError>(
      (resolve) => {
        const repositoryUser = this.users.get(userEmail);

        if (repositoryUser) {
          const {
            user_id,
            email,
            first_name,
            last_name,
            password,
            created_at,
            updated_at,
          } = repositoryUser;

          try {
            const user: User = User.fromData({
              id: user_id,
              email,
              firstName: first_name,
              lastName: last_name,
              password,
              createdAt: created_at,
              updatedAt: updated_at,
            });

            resolve(user);
          } catch (error) {
            resolve(
              SerializationError(
                "User serialization from <in memory repository> unsuccessful"
              )
            );
          }
        } else {
          resolve(ResourceNotFoundError(userEmail));
        }
      }
    );
  }
}
