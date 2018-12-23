
import consola from 'consola'
import sqorn from '@sqorn/pg'
import pg from 'pg'
import { registerBackends } from '../nuxt-services'

async function connect(id, settings) {
  if (!settings.connectionString) {
    for (const configProp of ['user', 'database', 'host', 'password', 'port']) {
      if (!settings[configProp]) {
        throw new Error(`No \`${configProp}\` configuration found for service \`${id}\``)
      }
    }
  } else {
    const dbNameMatch = settings.connectionString.match(/[^/]+\/([^/]+)$/)
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

  const pool = new pg.Pool(settings)
  await pool.connect()
  consola.info(`Connected to ${settings.database} database`)

  return sqorn({ pg, pool: pool })
}

export default async function () {
  await registerBackends.call(this, 'postgresql', connect)
}

