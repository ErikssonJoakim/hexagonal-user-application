type HTTPNetworkErrorContext = Readonly<{
  errorCode: number
  reason: string
  rawMessage: string
}>

export const HTTPNetworkError = ({ errorCode, reason, rawMessage }: HTTPNetworkErrorContext) =>
  ({
    _tag: 'network-http',
    errorCode,
    reason,
    rawMessage
  }) as const

/**
 *  Error when a HTTP newtwork response is not OK.
 */
export type HTTPNetworkError = ReturnType<typeof HTTPNetworkError>

export const NetworkUnspecifiedError = (reason: string) =>
  ({
    _tag: 'network-unspecified',
    reason
  }) as const

/**
 *  Error when a HTTP response is OK but there is a unspecified network error.
 */
export type NetworkUnspecifiedError = ReturnType<typeof NetworkUnspecifiedError>

export type NetworkError = HTTPNetworkError | NetworkUnspecifiedError

export const presentNetworkError = (error: NetworkError): string => {
  switch (error._tag) {
    case 'network-http': {
      return `Error ${error._tag}: An HTTP network error occurred with a <${error.errorCode}> code and the following reason <${error.reason}>.`
    }
    case 'network-unspecified': {
      return `Error ${error._tag}: An unspecified HTTP network error occurred with the following reason <${error.reason}>`
    }
  }
}
