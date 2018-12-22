
import { promisify } from 'util'
import consola from 'consola'
import redis from 'redis'

async function getJSON(key) {  
  const data = await this.get(key)
  return JSON.parse(data)
}

async function setJSON(key, value, cacheTimeout) {
  this.set(key, JSON.stringify(value), 'EX', cacheTimeout)
}

export default async function (options) {
  const redisConfig = Object.assign({}, options, this.options.redis)

  if (!redisConfig.host) {
    consola.warn('No `redis.host` configuration found, defaulting to `localhost`')
    redisConfig.host = 'localhost'
  }

  if (!redisConfig.port) {
    consola.warn('No `redis.port` configuration found, defaulting to `6379`')
    redisConfig.port = 6379
  }

  if (redisConfig.db) {
    redisConfig.db = { db: redisConfig.db }
  } else {
    consola.warn('No `redis.db` configuration found, defaulting to `0`')
    redisConfig.db = { db: 0 }
  }

  consola.info(`Connecting to redis://${redisConfig.host}:${redisConfig.port}/${redisConfig.db}...`)

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
      exportable.store = connect()
      exportable.store.on('error', errorCallback)
    }, redisConfig.autoReconnectInterval || 2000)
  }

  this.nuxt.$db = connect()
  this.nuxt.$db.on('error', errorCallback)

  consola.info(`Connected to ${redisConfig.host} database`)
}
