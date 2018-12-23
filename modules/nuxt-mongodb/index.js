import consola from 'consola'
import { MongoClient } from 'mongodb'
import { registerBackends } from '../nuxt-services'

async function connect(backend, settings) {
  if (!settings.url) {
    throw new Error(`No \`url\` configuration found for service \`${backend}\``)
  }

  const dbNameMatch = settings.url.match(/[^/]+\/([^/]+)$/)

  if (dbNameMatch) {
    settings.dbName = dbNameMatch[1]
  } else if (!settings.dbName) {
    // If dbName is neither present in url nor separately defined
    throw new Error('No `settings.dbName` configuration found')
  }

  // Defaults
  settings.findLimitDefault = settings.findLimitDefault || 20
  settings.findLimitMax = settings.findLimitMax || 100

  consola.info(`Connecting to ${settings.url}...`)
  const client = await MongoClient.connect(settings.url, {
    useNewUrlParser: true,
    ...settings.options
  })
  const db = client.db(settings.dbName)
  consola.info(`Connected to ${settings.dbName} database`)

  this.nuxt[`$${backend}`] = db
}

export default async function () {
  await registerBackends.call(this, 'mongodb', connect)
}
