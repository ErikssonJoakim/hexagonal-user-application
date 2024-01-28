describe('Util: String validator builder', () => {
  describe.each`
    stringToTest     | notEmpty     | min          | max          | lowerCases   | upperCases   | numbers      | specialCharacters | expectedResult
    ${'Some string'} | ${undefined} | ${undefined} | ${undefined} | ${undefined} | ${undefined} | ${undefined} | ${undefined}      | ${undefined}
  `(`Given that there is a string that needs validation: <$stringToTest>`, () => {
    xtest('To be implemented', () => {})
  })
})
