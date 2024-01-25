import type { ResourceNotFoundError } from "@/application/errors/resource";
import type { SerializationError } from "@/application/errors/serialization";
import type { ResourceAlreadyExistsError } from "@/application/errors/resource";
import { isResourceAlreadyExistsError } from "@/application/errors/resource";
import type { RegisterUserCommand } from "@/application/usecases/register-user.usecase";
import { RegisterUserUseCase } from "@/application/usecases/register-user.usecase";
import type { InMemoryUser } from "@/infra/user.inmemory.repository";
import { UserInMemoryRepository } from "@/infra/user.inmemory.repository";
import { StubDateProvider } from "@/infra/stub-date-provider";
import { StubIdProvider } from "@/infra/stub-id-provider";
import { User } from "@/domain/user";

export type RegisterUserFixture = {
  givenNowIs: (now: Date) => void;
  givenRepositoryIsPopulatedWith: (users: InMemoryUser[]) => void;
  whenUserRegisters: (
    registerUserCommand: RegisterUserCommand
  ) => Promise<void>;
  thenRegisteredUsersShouldBe: (expectedRegisteredUsers: User[]) => void;
  thenErrorShouldBe: (error?: ResourceAlreadyExistsError) => void;
};

// eslint-disable-next-line max-lines-per-function
export const createRegisterUserFixture = (): RegisterUserFixture => {
  let registrationError:
    | undefined
    | ResourceAlreadyExistsError
    | ResourceNotFoundError
    | SerializationError = undefined;
  const inMemoryRepository = new UserInMemoryRepository();
  const idProvider = new StubIdProvider();
  const dateProvider = new StubDateProvider();
  const registerUserUseCase = new RegisterUserUseCase(
    inMemoryRepository,
    idProvider,
    dateProvider
  );

  const givenRepositoryIsPopulatedWith = (users: InMemoryUser[]): void => {
    users.forEach((inMemoryUser) => {
      inMemoryRepository.users.set(inMemoryUser.email, inMemoryUser);
    });

    idProvider.id = (users.length + 1).toString();
  };

  const givenNowIs = (now: Date): void => {
    dateProvider.now = now;
  };

  const whenUserRegisters = async (
    registerUserCommand: RegisterUserCommand
  ): Promise<void> => {
    await registerUserUseCase.handle(registerUserCommand).then((response) => {
      if (isResourceAlreadyExistsError(response)) registrationError = response;
    });
  };

  const thenRegisteredUsersShouldBe = async (
    expectedRegisteredUsers: User[]
  ): Promise<void> => {
    const inMemoryMapKeys = [...inMemoryRepository.users.keys()];

    const registeredUsers = await Promise.all(
      inMemoryMapKeys.map(async (id) => {
        const response = await inMemoryRepository.getByID(id);
        if (User.isUser(response)) return response;
        registrationError = response;
      })
    );

    expect(registeredUsers).toStrictEqual(expectedRegisteredUsers);
  };

  const thenErrorShouldBe = (
    expectedError?: ResourceAlreadyExistsError
  ): void => {
    expect(registrationError).toStrictEqual(expectedError);
  };

  return {
    givenNowIs,
    givenRepositoryIsPopulatedWith,
    whenUserRegisters,
    thenRegisteredUsersShouldBe,
    thenErrorShouldBe,
  };
};
