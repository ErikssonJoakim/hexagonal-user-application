import type { UserResolvers } from '@/apps/graphql/schema/types.generated'

export const User: UserResolvers = {
  createdAt: ({ created_at }) => created_at,
  updatedAt: ({ updated_at }) => updated_at,
  firstName: ({ first_name }) => first_name,
  lastName: ({ last_name }) => last_name,
  id: ({ user_id }) => user_id
}
