type NodeConfig = {
  env?: string
}

type MysqlConfig = {
  host?: string
  port?: string
  user?: string
  database?: string
  password?: string
}

type GraphqlConfig = {
  port?: string
}

export type Config = {
  node?: NodeConfig
  dataSource: {
    mysql: MysqlConfig
    graphql: GraphqlConfig
  }
}
