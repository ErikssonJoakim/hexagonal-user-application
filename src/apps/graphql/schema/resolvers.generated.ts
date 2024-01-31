/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { createUser as Mutation_createUser } from './user/resolvers/Mutation/createUser';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { userLogin as Query_userLogin } from './user/resolvers/Query/userLogin';
import    { User } from './user/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { user: Query_user,userLogin: Query_userLogin },
      Mutation: { createUser: Mutation_createUser },
      
      User: User,
DateTime: DateTimeResolver
    }