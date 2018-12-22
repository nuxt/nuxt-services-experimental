import consola from 'consola'
import { MongoClient } from 'mongodb'

function connect(id, settings) {

  if (!settings.url) {
    throw new Error(`No \`url\` configuration found for \`${id}\``)
  }

  let dbNameMatch = settings.url.match(/[^/]+\/([^/]+)$/)

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

  return db
}

export default async function (options) {
  for (const service in this.options.services) {
    const serviceData = this.options.services[service]
    if (Array.isArray(serviceData) && serviceData[0] === 'mongodb') {
      let settings = {}
      if (!serviceData[1]) {
        serviceData[1] = {}
      }
      if (Object.keys(serviceData).length === 0) {
        throw new Error(`Configuration for \`${service}\` missing.`)
      }
      this.nuxt[`$${service}`] = connect(...serviceData)
    }
  }
}
