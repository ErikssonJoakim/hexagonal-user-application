import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";
import path from "path";

const config: CodegenConfig = {
  schema: path.resolve(__dirname, "**/schema.graphql"),
  generates: {
    "src/apps/graphql/schema": defineConfig(),
  },
};
export default config;
