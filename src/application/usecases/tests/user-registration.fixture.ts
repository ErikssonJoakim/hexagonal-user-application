import { UserInMemoryRepository } from "@/infra/user.inmemory.repository";
import type { RegisterUserCommand } from "@/application/usecases/register-user.usecase";
import { RegisterUserUseCase } from "@/application/usecases/register-user.usecase";
import { StubDateProvider } from "@/infra/stub-date-provider";
import { StubIdProvider } from "@/infra/stub-id-provider";
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
  const inMemoryRepository = new UserInMemoryRepository();
  const idProvider = new StubIdProvider();
  const dateProvider = new StubDateProvider();
  const registerUserUseCase = new RegisterUserUseCase(
    inMemoryRepository,
    idProvider,
    dateProvider
  );

  const givenRepositoryIsPopulatedWith = (users: User[]): void => {
    idProvider.id = "1";
    users.forEach((user) => {
      inMemoryRepository.create(user);
      idProvider.id = (idProvider.getId() + 1).toString();
    });
  };

  const givenNowIs = (now: Date): void => {
    dateProvider.now = now;
  };

  const whenUserRegisters = async (
    registerUserCommand: RegisterUserCommand
  ): Promise<void> => {
    registerUserUseCase.handle(registerUserCommand);
  };

  const thenRegisteredUserShouldBe = async (
    expectedUser: User | null
  ): Promise<void> => {
    const user =
      expectedUser && (await inMemoryRepository.getByEmail(expectedUser.email));
    expect(user).toStrictEqual(expectedUser);
  };

  return {
    givenNowIs,
    givenRepositoryIsPopulatedWith,
    whenUserRegisters,
    thenRegisteredUserShouldBe,
  };
};
