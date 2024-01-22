import type { UserRepositoryPort } from "@/application/ports/user.repository.port";
import type { Email } from "@/types/super-types";
import type * as mysql from "mysql2/promise";
import { User } from "@/domain/user";

interface MysqlUser extends mysql.RowDataPacket {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: Date;
  updated_at: Date | null;
}

const REGISTER_USER_QUERY =
  "INSERT INTO users(email, first_name, last_name, password) VALUES(?, ?, ?, ?);";

const GET_USER_BY_EMAIL =
  "SELECT user_id, email, first_name, last_name, password, created_at, updated_at FROM users WHERE email = ?;";

export class MysqlUserRepositoryAdaptor implements UserRepositoryPort {
  constructor(private readonly pool: mysql.Pool) {}

  async create(user: User): Promise<void> {
    const { email, firstName, lastName, password } = user.data;

    this.pool.execute<mysql.ResultSetHeader>(REGISTER_USER_QUERY, [
      email,
      firstName,
      lastName,
      password,
    ]);
  }

  async getByEmail(userEmail: Email): Promise<User | null> {
    return this.pool.execute<MysqlUser[]>(GET_USER_BY_EMAIL, [userEmail]).then(
      ([rows]) => {
        const {
          user_id,
          email,
          first_name,
          last_name,
          password,
          created_at,
          updated_at,
        } = rows[0];

        const user: User = User.fromData({
          id: user_id,
          email,
          firstName: first_name,
          lastName: last_name,
          password,
          createdAt: created_at,
          updatedAt: updated_at ?? undefined,
        });

        return user;
      },
      (error) => error
    );
  }
}
