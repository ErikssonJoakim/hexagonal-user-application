import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "src/apps/graphql/**/schema.graphql",
  generates: {
    "src/apps/graphql/schema": defineConfig(),
  },
};
export default config;
