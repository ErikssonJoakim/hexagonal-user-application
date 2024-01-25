import type { RegisterUserCommand } from "@/application/usecases/register-user.usecase";
import type { RegisterUserFixture } from "@/application/usecases/tests/user-registration.fixture";
import { createRegisterUserFixture } from "@/application/usecases/tests/user-registration.fixture";
import { ResourceAlreadyExistsError } from "@/application/errors/resource";
import type { InMemoryUser } from "@/infra/user.inmemory.repository";
import { User } from "@/domain/user";

type TestData = {
  preloadedState: { now: Date; repositoryState: InMemoryUser[] };
  userToRegister: RegisterUserCommand;
  expectedRegisteredUsers: User[];
  expectedError?: ResourceAlreadyExistsError;
};

// eslint-disable-next-line max-lines-per-function
describe("Feature: Register user", () => {
  const repositoryUser1: InMemoryUser = {
    user_id: "1",
    email: "john.dorian@gmail.com",
    first_name: "John",
    last_name: "Dorian",
    password: "eagle",
    created_at: new Date("2024-01-20T22:08:10.000Z"),
  };

  const user1: User = User.fromData({
    id: "1",
    email: "john.dorian@gmail.com",
    firstName: "John",
    lastName: "Dorian",
    password: "eagle",
    createdAt: new Date("2024-01-20T22:08:10.000Z"),
  });

  const userRegistrationInput1: RegisterUserCommand = {
    email: "john.dorian@gmail.com",
    firstName: "John",
    lastName: "Dorian",
    password: "eagle",
  };

  let fixture: RegisterUserFixture;

  beforeEach(() => {
    fixture = createRegisterUserFixture();
  });

  describe.each`
    preloadedState                                                                       | userToRegister            | expectedRegisteredUsers | expectedError
    ${{ now: new Date("2024-01-20T22:08:10.000Z"), repositoryState: [] }}                | ${userRegistrationInput1} | ${[user1]}              | ${undefined}
    ${{ now: new Date("2024-01-20T22:08:10.000Z"), repositoryState: [repositoryUser1] }} | ${userRegistrationInput1} | ${[user1]}              | ${ResourceAlreadyExistsError([user1.email])}
  `(
    `Given that there is a user registering with the email: <$userToRegister.email>`,
    ({
      preloadedState: { now, repositoryState },
      userToRegister,
      expectedRegisteredUsers,
      expectedError,
    }: TestData) => {
      describe(`And ${
        repositoryState.length
          ? `${JSON.stringify(repositoryState.map(({ email }) => email))} ${
              repositoryState.length > 1 ? "are" : "is"
            }`
          : "no emails are"
      } already registered`, () => {
        test(`Then the user ${
          repositoryState.find((user) => user.email === userToRegister.email)
            ? "is not"
            : "is"
        } registered`, async () => {
          fixture.givenNowIs(now);
          await fixture.givenRepositoryIsPopulatedWith(repositoryState);
          await fixture.whenUserRegisters(userToRegister);
          await fixture.thenRegisteredUsersShouldBe(expectedRegisteredUsers);
        });
        test(`Then ${
          expectedError ? `a ${expectedError._tag}` : "no"
        } error is returned`, async () => {
          fixture.givenNowIs(now);
          await fixture.givenRepositoryIsPopulatedWith(repositoryState);
          await fixture.whenUserRegisters(userToRegister);
          fixture.thenErrorShouldBe(expectedError);
        });
      });
    }
  );
});
