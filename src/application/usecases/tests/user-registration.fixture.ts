import type { RegisterUserCommand } from "@/application/usecases/register-user.usecase";
import type { User } from "@/domain/user";

type Fixture = {
  givenNowIs: (now: Date) => void;
  givenRepositoryIsPopulatedWith: (users: User[]) => void;
  whenUserRegisters: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<void>;
  thenRegisteredUserShouldBe: (expectedUser: User | null) => Promise<void>;
};

export const createFixture = (): Fixture => {
  const givenRepositoryIsPopulatedWith = (users: User[]): void => {};

  const whenUserRegisters = async (
    registerUserCommand: RegisterUserCommand
  ): Promise<void> => {};

  const thenRegisteredUserShouldBe = async (
    expectedUser: User | null
  ): Promise<void> => {
    expect(false).toStrictEqual(true);
  };

  return {
    givenNowIs,
    givenRepositoryIsPopulatedWith,
    whenUserRegisters,
    thenRegisteredUserShouldBe,
  };
};
