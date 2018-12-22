import consola from 'consola'
import { Pool } from 'pg'

export default async function (options) {
  const pgsql = Object.assign({}, options, this.options.postgresql)

  for (const configProp of ['user', 'database', 'host', 'password', 'port']) {
    if (!pgsql[configProp]) {
      throw new Error(`No \`postgresql.${configProp}\` configuration found`)
    }
  }

  consola.info(`Connecting to postgresql://${pgsql.host}:${pgsql.port}/${pgsql.database}...`)
  const pool = await new Pool(pgsql).connect()
  consola.info(`Connected to ${pgsql.database} database`)

  this.nuxt.$db = pool
}
