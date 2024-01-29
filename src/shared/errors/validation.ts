export const ValidationNotConformError = (ruleMessages: string[]) =>
  ({
    _tag: 'value-not-conform',
    ruleMessages
  }) as const

/**
 *  Error when a value does not conform to validation rules.
 */
export type ValidationNotConformError = ReturnType<typeof ValidationNotConformError>

export type ValidationError = ValidationNotConformError

export const isValidationNotConformError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
): error is ValidationNotConformError => !!error && error._tag === 'value-not-conform'
