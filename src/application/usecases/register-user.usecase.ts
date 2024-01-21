import type { Email, Password } from "@/types/super-types";

export type RegisterUserCommand = {
  email: Email;
  firstName: string;
  lastName: string;
  password: Password;
};

export class RegisterUserUseCase {

  async handle({
    email,
    firstName,
    lastName,
    password,
  }: RegisterUserCommand): Promise<void> {}
}
