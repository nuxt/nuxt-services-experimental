import consola from 'consola'
import { Pool } from 'pg'

export default async function (options) {
  const pgsql = Object.assign({}, options, this.options.postgresql)

  let connectionInfo
  if (pgsql.connectionString) {
    connectionInfo = {
      connectionString: pgsql.connectionString
    }
  } else {
    for (const configProp of ['connectionString', 'user', 'database', 'host', 'password', 'port']) {
      if (!pgsql[configProp]) {
        throw new Error(`PostgreSQL connection configuration missing or incomplete`)
      }
    }
    connectionInfo = pgsql
  }

  if (pgsql.connectionString) {
    consola.info(`Connecting to ${connectionString}...`)
  } else {
    consola.info(`Connecting to postgresql://${pgsql.host}:${pgsql.port}/${pgsql.database}...`)
  }
  const pool = await new Pool(pgsql).connect()
  consola.info(`Connected to ${pgsql.database} database`)

  this.nuxt.$db = pool
}
