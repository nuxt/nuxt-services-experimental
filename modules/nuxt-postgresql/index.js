
import consola from 'consola'
import sqorn from 'sqorn'
import pg from 'pg'

export default async function (options) {
  const pgsql = Object.assign({}, options, this.options.postgresql)

  if (!pgsql.connectionString) {
    for (const configProp of ['user', 'database', 'host', 'password', 'port']) {
      if (!pgsql[configProp]) {
        throw new Error(`PostgreSQL connection configuration missing or incomplete`)
      }
    }
  }

  if (pgsql.connectionString) {
    consola.info(`Connecting to ${pgsql.connectionString}...`)
  } else {
    consola.info(`Connecting to postgresql://${pgsql.host}:${pgsql.port}/${pgsql.database}...`)
  }
  const pool = await new pg.Pool(pgsql).connect()
  consola.info(`Connected to ${pgsql.database} database`)

  this.nuxt.$db = sqorn({ pg, pool: pool })
}
