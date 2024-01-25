import {
  ResourceNotFoundError,
  presentResourceError,
} from "@/application/errors/resource";
import type { Context } from "@/apps/graphql/index";
import type { MutationResolvers } from "@/apps/graphql/schema/types.generated";
import { GraphQLError } from "graphql";

export const createUser: NonNullable<MutationResolvers["createUser"]> = async (
  _parent,
  _arg,
  _ctx: Context
) => {
  const { register, getByEmail } = _ctx.dataSources.userAPI;
  await register(_arg.input).then((response) => {
    if (response) {
      switch (response._tag) {
        case "resource-already-exists":
          throw new GraphQLError(presentResourceError(response), {
            extensions: { code: "CONFLICT" },
          });
      }
    }
  });

  const user = await getByEmail(_arg.input.email).then((response) => {
    if (user) return response;
    switch (response._tag) {
      case "resource-not-found": {
        throw new GraphQLError(
          presentResourceError(ResourceNotFoundError(_arg.input.email)),
          { extensions: { code: "NOT_FOUND" } }
        );
      }
    }
  });

  if (user) {
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
