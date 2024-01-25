import { presentNetworkError } from "@/application/errors/network";
import {
  ResourceNotFoundError,
  presentResourceError,
} from "@/application/errors/resource";
import type { Context } from "@/apps/graphql/index";
import type { MutationResolvers } from "@/apps/graphql/schema/types.generated";
import { User } from "@/domain/user";
import { GraphQLError } from "graphql";

// eslint-disable-next-line max-lines-per-function
export const createUser: NonNullable<MutationResolvers["createUser"]> = async (
  _parent,
  _arg,
  _ctx: Context
) => {
  const { register, getByEmail } = _ctx.dataSources.userAPI;
  await register(_arg.input).then((response) => {
    if (response) {
      switch (response._tag) {
        case "network-http":
          throw new GraphQLError(presentNetworkError(response), {
            extensions: { code: "SERVICE_UNAVAILABLE" },
          });
        case "network-unspecified":
          throw new GraphQLError(presentNetworkError(response), {
            extensions: { code: "UNSPECIFIED" },
          });
        case "resource-already-exists":
          throw new GraphQLError(presentResourceError(response), {
            extensions: { code: "CONFLICT" },
          });
      }
    }
  });

  const user = await getByEmail(_arg.input.email).then((response) => {
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
      case "resource-not-found": {
        throw new GraphQLError(
          presentResourceError(ResourceNotFoundError(_arg.input.email)),
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
