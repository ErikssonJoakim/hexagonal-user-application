import type { Maybe, Scalars } from '@/apps/graphql/schema/types.generated'

export interface UserMapper {
  user_id: Scalars['ID']['output']
  email: Scalars['String']['output']
  first_name: Scalars['String']['output']
  last_name: Scalars['String']['output']
  password: Scalars['String']['output']
  created_at: Scalars['DateTime']['output']
  updated_at?: Maybe<Scalars['DateTime']['output']>
}
