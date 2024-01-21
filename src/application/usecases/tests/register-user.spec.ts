import type { RegisterUserCommand } from "@/application/usecases/register-user.usecase";
import { createFixture } from "@/application/usecases/tests/user-registration.fixture";
import { User } from "@/domain/user";

type TestData = {
  now: Date;
  registeredUsers: User[];
  registerUserCommand: RegisterUserCommand;
  expectedUser: User;
};

// eslint-disable-next-line max-lines-per-function
describe("Feature: Register user", () => {
  const user1: User = User.fromData({
    id: "1",
    email: "john.dorian@gmail.com",
    firstName: "John",
    lastName: "Dorian",
    password: "eagle",
    createdAt: new Date("2024-01-20T22:08:10.000Z"),
    updatedAt: undefined,
  });

  const userRegistrationInput1: RegisterUserCommand = {
    email: "john.dorian@gmail.com",
    firstName: "John",
    lastName: "Dorian",
    password: "eagle",
  };

  describe.each`
    now                                     | registeredUsers | registerUserCommand       | expectedUser | error
    ${new Date("2024-01-20T22:08:10.000Z")} | ${[]}           | ${userRegistrationInput1} | ${user1}     | ${undefined}
    ${new Date("2024-01-20T22:08:10.000Z")} | ${[user1]}      | ${userRegistrationInput1} | ${null}      | ${undefined}
  `(
    `Given that there is a user registering with the email: <$registerUserCommand.email>`,
    ({ now, registeredUsers, registerUserCommand, expectedUser }: TestData) => {
      const {
        givenNowIs,
        givenRepositoryIsPopulatedWith,
        whenUserRegisters,
        thenRegisteredUserShouldBe,
      } = createFixture();

      describe(`And ${
        registeredUsers.length
          ? `${JSON.stringify(registeredUsers.map(({ email }) => email))} ${
              registeredUsers.length > 1 ? "are" : "is"
            }`
          : "no emails are"
      } already registered`, () => {
        test(`The user ${
          registeredUsers.includes(expectedUser) ? "is not" : "is"
        } registered`, async () => {
          givenNowIs(now);
          givenRepositoryIsPopulatedWith(registeredUsers);
          await whenUserRegisters(registerUserCommand);
          await thenRegisteredUserShouldBe(expectedUser);
        });
      });
    }
  );
});
