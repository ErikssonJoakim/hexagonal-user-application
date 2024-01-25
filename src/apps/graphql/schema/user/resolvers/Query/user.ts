import type { QueryResolvers } from "@/apps/graphql/schema/types.generated";
import type { Context } from "@/apps/graphql";
import { GraphQLError } from "graphql";
import {
  SerializationError,
  presentSerializationError,
} from "@/application/errors/serialization";
import {
  ResourceNotFoundError,
  presentResourceError,
} from "@/application/errors/resource";
import { presentNetworkError } from "@/application/errors/network";
import { User } from "@/domain/user";

export const user: NonNullable<QueryResolvers["user"]> = async (
  _parent,
  _arg,
  _ctx: Context
) => {
  const { getByID } = _ctx.dataSources.userAPI;

  const user = await getByID(_arg.id).then((response) => {
    if (User.isUser(response)) return response;
    switch (response._tag) {
      case "network-http":
        throw new GraphQLError(presentNetworkError(response), {
          extensions: { code: "SERVICE_UNAVAILABLE" },
        });
      case "network-unspecified":
        throw new GraphQLError(presentNetworkError(response), {
          extensions: { code: "UNSPECIFIED" },
        });
      case "serialization": {
        throw new GraphQLError(
          presentSerializationError(SerializationError(response.reason)),
          { extensions: { code: "INTERNAL_SERVER_ERROR" } }
        );
      }
      case "resource-not-found": {
        throw new GraphQLError(
          presentResourceError(ResourceNotFoundError(_arg.id)),
          { extensions: { code: "NOT_FOUND" } }
        );
      }
    }
  });

  if (User.isUser(user)) {
    const { id, email, firstName, lastName, password, createdAt, updatedAt } =
      user;

    return {
      user_id: id,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }
};
