
import { promisify } from 'util'
import consola from 'consola'
import redis from 'redis'
import { registerBackends } from '../nuxt-service'

async function getJSON(key) {
  const data = await this.get(key)
  return JSON.parse(data)
}

function setJSON(key, value, cacheTimeout) {
  return this.set(key, JSON.stringify(value), 'EX', cacheTimeout)
}

function connect(id, settings) {
  if (!settings.host) {
    consola.warn(`No \`host\` configuration found for service \`${id}\`, defaulting to \`localhost\``)
    settings.host = 'localhost'
  }

  if (!settings.port) {
    consola.warn(`No \`port\` configuration found for service \`${id}\`, defaulting to \`6379\``)
    settings.port = 6379
  }

  if (settings.db) {
    settings.db = { db: settings.db }
  } else {
    consola.warn(`No \`db\` configuration found for service \`${id}\`, defaulting to \`0\``)
    settings.db = { db: 0 }
  }

  consola.info(`Connecting to redis://${settings.host}:${settings.port}/${settings.db}...`)

  const _connect = () => {
    const client = redis.createClient(settings)
    client.get = promisify(client.get).bind(client)
    client.set = promisify(client.set).bind(client)
    client.getJSON = getJSON.bind(client)
    client.setJSON = setJSON.bind(client)
    return client
  }

  let db

  const errorCallback = () => {
    setTimeout(() => {
      db = _connect()
      db.on('error', errorCallback)
    }, settings.autoReconnectInterval || 2000)
  }

  db = _connect()
  db.on('error', errorCallback)

  consola.info(`Connected to ${settings.host} database`)

  return db
}

export default registerBackends('redis', connect)
