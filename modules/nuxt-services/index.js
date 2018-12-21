import { resolve, join } from 'path'
import { promisify } from 'util'
import devalue from '@nuxtjs/devalue'
import WebSocket from 'ws'

const glob = promisify(require('glob'))

export default async function() {
  /*
   * Fetch services
   */
  const servicesPath = resolve(this.options.srcDir, 'services')
  const files = await glob(join(servicesPath, '/**/*.js'))
  this.options.watch = this.options.watch.concat(files)
  const services = {}
  const servicesMap = {}

  files.map(path => {
    const serviceKey = path
      .replace(servicesPath, '')
      .replace(/^\//, '')
      .replace(/\.js$/, '')
    const keys = serviceKey.split('/')
    const service = this.nuxt.resolver.requireModule(path) || {}
    // TODO: Use class instead, and have this.context
    Object.keys(service).forEach((method) => {
      if (typeof service[method] === 'function')
        service[method] = service[method].bind(this.nuxt)
    })

    servicesMap[serviceKey] = Object.keys(service)

    let s = services
    keys.forEach((key, i) => {
      if (i + 1 < keys.length) {
        s[key] = s[key] || {}
        s = s[key]
        return
      }
      s[key] = service
    })
  })
  /*
  ** Add plugin
  */
  const url = `ws://${this.options.server.host}:${this.options.server.port}`
  this.addPlugin({
    filename: 'services.ws.client.js',
    src: join(__dirname, 'plugin.client.js'),
    ssr: false,
    options: {
      url,
      servicesMap
    }
  })
  this.addPlugin({
    filename: 'services.ws.server.js',
    src: join(__dirname, 'plugin.server.js')
  })
  this.addServerMiddleware((req, res, next) => {
    req.services = services
    next()
  })
  /*
   ** Create WS server
   */
  this.nuxt.hook('listen', server => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', ws => {
      ws.services = services

      ws.on('error', err => Consola.error(err))

      ws.on('message', async msg => {
        let obj
        try {
          obj = (0,eval)(`(${msg})`)
        } catch (e) {
          return // Ignore it
        }
        if (typeof obj.challenge === 'undefined')
          return consola.error('No challenge given to', obj)

        let data = null
        let error = null

        switch (obj.action) {
          case 'call':
            try {
              let serviceModule = ws.services
              obj.module.split('/').forEach((m) => serviceModule = serviceModule[m])
              data = await serviceModule[obj.method].call(this.nuxt, ...obj.args)
            } catch (e) {
              error = JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)))
              if (!this.options.dev) delete error.stack
            }
            break
          default:
        }

        const payload = {
          action: 'return',
          challenge: obj.challenge || 0,
          data,
          error
        }

        ws.send(devalue(payload))
      })
    })
    consola.info('Websockets server ready for services')
  })
}
