import "dotenv/config";
import type { Config } from "@/types/config.type";

export const config: Config = {
  node: {
    env: process.env.NODE_ENV,
  },
  dataSource: {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      password: process.env.MYSQL_PASSWORD,
    },
  },
};
