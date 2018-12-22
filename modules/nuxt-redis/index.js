
import { promisify } from 'util'
import consola from 'consola'
import redis from 'redis'
import { registerServices } from '../nuxt-service'

async function getJSON(key) {  
  const data = await this.get(key)
  return JSON.parse(data)
}

async function setJSON(key, value, cacheTimeout) {
  this.set(key, JSON.stringify(value), 'EX', cacheTimeout)
}

async function connect (id, settings) {
  if (!settings.host) {
    consola.warn('No `host` configuration found for service ``, defaulting to `localhost`')
    settings.host = 'localhost'
  }

  if (!settings.port) {
    consola.warn('No `redis.port` configuration found, defaulting to `6379`')
    settings.port = 6379
  }

  if (settings.db) {
    settings.db = { db: settings.db }
  } else {
    consola.warn('No `redis.db` configuration found, defaulting to `0`')
    settings.db = { db: 0 }
  }

  consola.info(`Connecting to redis://${settings.host}:${settings.port}/${settings.db}...`)

  const connect = () => {
    const client = redis.createClient(redisConfig)
    client.get = promisify(client.get).bind(client)
    client.set = promisify(client.set).bind(client)
    client.getJSON = getJSON.bind(client)
    client.setJSON = setJSON.bind(client)
    return client
  }

  const errorCallback = () => {
    setTimeout(() => {
      this.nuxt.$db = connect()
      this.nuxt.$db.on('error', errorCallback)
    }, settings.autoReconnectInterval || 2000)
  }

  this.nuxt.$db = connect()
  this.nuxt.$db.on('error', errorCallback)

  consola.info(`Connected to ${settings.host} database`)
}

export default registerServices('redis', connect)
