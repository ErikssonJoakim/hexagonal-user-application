import { ResourceNotFoundError, presentResourceError } from '@/shared/errors/resource'
import dotenv from 'dotenv'
import type { Config } from '@/types/config.type'
import fs from 'fs'

enum EnvFile {
  PRODUCTION = '.env.production',
  DEVELOPMENT = '.env.development'
}

// Prioritizes using production environment before development
const envFiles = fs
  .readdirSync('.')
  .filter(file => file === EnvFile.PRODUCTION || file === EnvFile.DEVELOPMENT)
  .sort((a, b) => b.localeCompare(a))

if (envFiles.length === 0)
  throw presentResourceError(ResourceNotFoundError([EnvFile.PRODUCTION, EnvFile.DEVELOPMENT]))

dotenv.config({ path: envFiles[0] })

export const config: Config = {
  node: {
    env: process.env.NODE_ENV
  },
  dataSource: {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      password: process.env.MYSQL_ROOT_PASSWORD
    }
  }
}
