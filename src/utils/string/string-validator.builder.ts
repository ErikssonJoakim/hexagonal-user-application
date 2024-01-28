type RuleMessage = string
export type StringValidationRule<T extends boolean | number | RegExp> = [T, RuleMessage]

export type CharacterValidationRule = {
  acceptedCharacters: RegExp
  min?: [number, RuleMessage]
}

export type StringRules = {
  notEmpty?: [boolean, RuleMessage]
  min?: [number, RuleMessage]
  max?: [number, RuleMessage]
  lowerCases?: CharacterValidationRule
  upperCases?: CharacterValidationRule
  digits?: CharacterValidationRule
  specialCharacters?: CharacterValidationRule
  pattern?: StringValidationRule<RegExp>
}

type StringRuleValidator = (string: string) => RuleMessage | undefined
type StringValidator = (string: string) => RuleMessage[]

type StringValidationBuilder = (stringRules?: StringRules) => {
  notEmpty: (notEmptyRule: [boolean, RuleMessage]) => ReturnType<StringValidationBuilder>
  min: (minRule: [number, RuleMessage]) => ReturnType<StringValidationBuilder>
  max: (maxRule: [number, RuleMessage]) => ReturnType<StringValidationBuilder>
  lowerCases: (lowerCasesRule: CharacterValidationRule) => ReturnType<StringValidationBuilder>
  upperCases: (upperCasesRule: CharacterValidationRule) => ReturnType<StringValidationBuilder>
  digits: (numbersRule: CharacterValidationRule) => ReturnType<StringValidationBuilder>
  specialCharacters: (
    specialCharactersRule: CharacterValidationRule
  ) => ReturnType<StringValidationBuilder>
  pattern: (patternRule: StringValidationRule<RegExp>) => ReturnType<StringValidationBuilder>
  build: () => StringValidator
}

// eslint-disable-next-line max-lines-per-function
export const stringValidatorBuilder: StringValidationBuilder = ({
  notEmpty = [false, ''] as StringValidationRule<boolean>,
  min,
  max,
  lowerCases = {
    acceptedCharacters: new RegExp('a-z'),
    min: [0, ''] as StringValidationRule<number>
  },
  upperCases = {
    acceptedCharacters: new RegExp('A-Z'),
    min: [0, ''] as StringValidationRule<number>
  },
  digits = { acceptedCharacters: new RegExp('0-9'), min: [0, ''] as StringValidationRule<number> },
  specialCharacters = {
    acceptedCharacters: new RegExp(`/\\/#,@_!{}()\\[\\]:;.|$=\\-+?&~%"'/`),
    min: [0, ''] as StringValidationRule<number>
  },
  pattern
} = {}) => {
  const props = { notEmpty, min, max, lowerCases, upperCases, digits, specialCharacters, pattern }

  const validateNotEmpty: StringRuleValidator = string => {
    if (notEmpty[0] && string.length === 0) return notEmpty[1]
  }

  const validateStringMin: StringRuleValidator = string => {
    if (min && string.length < min[0]) return min[1]
  }

  const validateStringMax: StringRuleValidator = string => {
    if (max && string.length > max[0]) return max[1]
  }

  const validateCharacters: StringRuleValidator = string => {
    const invalidCharacters = string.replaceAll(
      new RegExp(
        `[
          ${lowerCases.acceptedCharacters}
          ${upperCases.acceptedCharacters}
          ${digits.acceptedCharacters}
          ${specialCharacters.acceptedCharacters}
        ]*`,
        'g'
      ),
      ''
    )

    if (invalidCharacters.length !== 0)
      return `The following characters are invalid: <${invalidCharacters.split('').join(', ')}>`
  }

  const validatePattern: StringRuleValidator = string => {
    if (pattern && !pattern[0].test(string)) return pattern[1]
  }

  return {
    notEmpty: notEmpty => stringValidatorBuilder({ ...props, notEmpty }),
    min: min => stringValidatorBuilder({ ...props, min }),
    max: max => stringValidatorBuilder({ ...props, max }),
    lowerCases: lowerCases => stringValidatorBuilder({ ...props, lowerCases }),
    upperCases: upperCases => stringValidatorBuilder({ ...props, upperCases }),
    digits: digits => stringValidatorBuilder({ ...props, digits }),
    specialCharacters: specialCharacters => stringValidatorBuilder({ ...props, specialCharacters }),
    pattern: pattern => stringValidatorBuilder({ ...props, pattern }),
    build: () => string =>
      [lowerCases, upperCases, digits, specialCharacters].reduce<RuleMessage[]>(
        (ruleMessages, characterValidationRule) => {
          const minMessage = new RegExp(
            `(.*?[${characterValidationRule.acceptedCharacters}]){${characterValidationRule.min?.[0] ?? '0'},}`
          ).test(string)
            ? undefined
            : characterValidationRule.min?.[1]

          return minMessage ? [...ruleMessages, minMessage] : ruleMessages
        },
        [
          validateNotEmpty(string),
          validateStringMin(string),
          validateStringMax(string),
          validateCharacters(string),
          validatePattern(string)
        ].reduce<RuleMessage[]>((acc, cur) => (cur ? [...acc, cur] : acc), [])
      )
  }
}
