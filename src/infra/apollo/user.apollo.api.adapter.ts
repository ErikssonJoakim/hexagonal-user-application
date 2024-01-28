import type { UserRepositoryPort } from '@/application/ports/user.repository.port'
import type { User } from '@/domain/user'
import {
  HTTPNetworkError,
  NetworkUnspecifiedError,
  type NetworkError
} from '@/shared/errors/network'
import type { ID } from '@/types/super-types'
import { ResourceNotFoundError } from '@/shared/errors/resource'
import { ResourceAlreadyExistsError } from '@/shared/errors/resource'
import type { SerializationError } from '@/shared/errors/serialization'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { gql, isApolloError } from '@apollo/client'

const CREATE_USER = gql`
  mutation ($input: UserRegistration!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      password
      createdAt
      updatedAt
    }
  }
`

const USER_ID = gql`
  query ($userId: ID!) {
    user(id: $userId) {
      id
      email
      firstName
      lastName
      password
      createdAt
      updatedAt
    }
  }
`

export class ApolloUserRepositoryAdaptor implements UserRepositoryPort {
  constructor(private readonly client: ApolloClient<NormalizedCacheObject>) {}

  // eslint-disable-next-line max-lines-per-function
  async create({
    email,
    firstName,
    lastName,
    password
  }: User): Promise<ID | NetworkError | ResourceAlreadyExistsError> {
    return this.client
      .mutate<{ createUser: User }>({
        mutation: CREATE_USER,
        variables: {
          input: {
            email,
            firstName,
            lastName,
            password
          }
        }
      })
      .then(
        ({ data }) => data?.createUser.id ?? NetworkUnspecifiedError('Unable to retrieve user id'),
        error => {
          if (isApolloError(error) && error.message === 'Failed to fetch')
            return HTTPNetworkError({
              errorCode: 503,
              reason: 'api not available',
              rawMessage: error.message
            })

          // TODO: Create error code enum
          // TODO: Create more specific Errors
          switch (error.code) {
            case 'SERVICE_UNAVAILABLE':
              return HTTPNetworkError({
                errorCode: 503,
                reason: 'api network issues',
                rawMessage: error.message
              })
            case 'INTERNAL_SERVER_ERROR':
              return NetworkUnspecifiedError('server error while treating request')
            case 'CONFLICT':
              return ResourceAlreadyExistsError([email])
            case 'NOT_FOUND':
            case 'UNSPECIFIED':
            default:
              return NetworkUnspecifiedError('an unspecified error occured while registering user')
          }
        }
      )
  }

  async getByID(
    id: string
  ): Promise<User | NetworkError | SerializationError | ResourceNotFoundError> {
    return this.client
      .query<User>({
        query: USER_ID,
        variables: {
          input: {
            id
          }
        }
      })
      .then(
        ({ data }) => data,
        error => {
          switch (error.code) {
            case 'SERVICE_UNAVAILABLE':
              return HTTPNetworkError({
                errorCode: 503,
                reason: 'api network issues',
                rawMessage: error.message
              })
            case 'INTERNAL_SERVER_ERROR':
              return NetworkUnspecifiedError('server error while treating request ')
            case 'NOT_FOUND':
              return ResourceNotFoundError('Unable to retrieve user by id')
            case 'UNSPECIFIED':
            default:
              return NetworkUnspecifiedError('an unspecified error occured while fetching user')
          }
        }
      )
  }
}
