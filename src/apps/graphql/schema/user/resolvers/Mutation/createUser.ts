import type { Context } from "@/apps/graphql/index";
import type { MutationResolvers } from "@/apps/graphql/schema/types.generated";

export const createUser: NonNullable<MutationResolvers["createUser"]> = async (
  _parent,
  _arg,
  _ctx: Context
) => {
  const { register, getByEmail } = _ctx.dataSources.userAPI;
  await register(_arg.input);
  const user = await getByEmail(_arg.input.email);

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
