import consola from 'consola'
import { MongoClient, ObjectID } from 'mongodb'

export default async function (options) {
	const mongodb = Object.assign({}, options, this.options.mongodb)

	if (!mongodb) throw new Error('No `mongodb` configuration found')
	if (!mongodb.url) throw new Error('No `mongodb.url` configuration found')
	if (!mongodb.dbName) throw new Error('No `mongodb.dbName` configuration found')

	// Defaults
	mongodb.findLimitDefault = mongodb.findLimitDefault || 20
	mongodb.findLimitMax = mongodb.findLimitMax || 100

	consola.info(`Connecting to ${mongodb.url}...`)
	const client = await MongoClient.connect(mongodb.url, { useNewUrlParser: true, ...mongodb.options })
	const db = client.db(mongodb.dbName)
  consola.info(`Connected to ${mongodb.dbName} database`)

  this.nuxt.hook('services:context', (context) => {
    context.$mongodb = db
  })
  this.nuxt.hook('build:done', () => {
    consola.info(`Closing ${mongodb.dbName} database`)
    client.close()
  })
}

