import type { UserResolvers } from "./../../types.generated";
export const User: UserResolvers = {
  /* Implement User resolver logic here */
    createdAt: () => { /* User.createdAt resolver is required because User.createdAt exists but UserMapper.createdAt does not */ },
    firstName: () => { /* User.firstName resolver is required because User.firstName exists but UserMapper.firstName does not */ },
    id: () => { /* User.id resolver is required because User.id exists but UserMapper.id does not */ },
    lastName: () => { /* User.lastName resolver is required because User.lastName exists but UserMapper.lastName does not */ },
    updatedAt: () => { /* User.updatedAt resolver is required because User.updatedAt exists but UserMapper.updatedAt does not */ }
};
