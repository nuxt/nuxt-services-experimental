import consola from 'consola'
import { MongoClient } from 'mongodb'

export default async function (options) {
  const mongodb = Object.assign({}, options, this.options.mongodb)

  if (!mongodb.url) {
    throw new Error('No `mongodb.url` configuration found')
  }

  let dbNameMatch = mongodb.url.match(/[^/]+\/([^/]+)$/)

  if (dbNameMatch) {
    mongodb.dbName = dbNameMatch[1]
  } else if (!mongodb.dbName) {
    // If dbName is neither present in url nor separately defined
    throw new Error('No `mongodb.dbName` configuration found')
  }

  // Defaults
  mongodb.findLimitDefault = mongodb.findLimitDefault || 20
  mongodb.findLimitMax = mongodb.findLimitMax || 100

  consola.info(`Connecting to ${mongodb.url}...`)
  const client = await MongoClient.connect(mongodb.url, { useNewUrlParser: true, ...mongodb.options })
  const db = client.db(mongodb.dbName)
  consola.info(`Connected to ${mongodb.dbName} database`)

  this.nuxt.$db = db
}
