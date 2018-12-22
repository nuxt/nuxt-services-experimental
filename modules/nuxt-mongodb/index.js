import consola from 'consola'
import { MongoClient } from 'mongodb'

export default async function (options) {
  const mongodb = Object.assign({}, options, this.options.mongodb)

  if (!mongodb.url) {
    throw new Error('No `mongodb.url` configuration found')
  }

  let dbNameMatch = mongodb.url.match(/[^/]+\/([^/]+)$/)
  // If dbName is not present in url
  if (dbNameMatch) { // eslint-disable-line no-cond-assign
    mongodb.dbName = dbNameMatch[1]
  } else if (!mongodb.dbName) {
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
