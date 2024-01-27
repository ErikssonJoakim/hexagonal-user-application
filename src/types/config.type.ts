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

export type Config = {
  node: NodeConfig
  dataSource: {
    mysql: MysqlConfig
  }
}
