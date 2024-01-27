export const SerializationError = (reason: string) =>
  ({
    _tag: 'serialization',
    reason
  }) as const

/**
 *  Error when a serialization operation fails
 */
export type SerializationError = ReturnType<typeof SerializationError>

export const presentSerializationError = (error: SerializationError): string => {
  switch (error._tag) {
    case 'serialization': {
      return `Error ${error._tag}: Failed to serialize data due to the following reason <${error.reason}>`
    }
  }
}
