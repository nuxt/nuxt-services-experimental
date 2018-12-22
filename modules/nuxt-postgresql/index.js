
import consola from 'consola'
import sqorn from '@sqorn/pg'
import pg from 'pg'

function connect (id, settings) {
  if (!settings.connectionString) {
    for (const configProp of ['user', 'database', 'host', 'password', 'port']) {
      if (!pgsql[configProp]) {
        throw new Error(`No \`${configProp}\` configuration found for service \`${id}\``)
      }
    }
  } else {
    let dbNameMatch = settings.connectionString.match(/[^/]+\/([^/]+)$/)
    if (dbNameMatch) {
      settings.database = dbNameMatch[1]
    } else if (!settings.database) {
      // If database is neither present in url nor separately defined
      throw new Error('No `postgresql.database` configuration found')
    }
  }

  if (settings.connectionString) {
    consola.info(`Connecting to ${settings.connectionString}...`)
  } else {
    consola.info(`Connecting to postgresql://${
      settings.host}:${settings.port}/${settings.database}...`)
  }
  const pool = await new pg.Pool(pgsql).connect()
  consola.info(`Connected to ${settings.database} database`)

  return sqorn({ pg, pool: pool })
}


export default registerServices('postgresql')
