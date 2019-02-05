import { resolve, join } from 'path'
import { promisify } from 'util'
import devalue from '@nuxtjs/devalue'
import WebSocket from 'ws'
import { getServiceMethods, loadServices } from './src/utils'

const glob = promisify(require('glob'))

export default async function() {
  /*
   * Fetch services
   */
  const servicesPath = resolve(this.options.srcDir, 'services')
  const files = await glob(join(servicesPath, '/**/*.js'))
  this.options.watch = this.options.watch.concat(files)
  const Services = {}
  const ServicesMethods = {}

  files.map(path => {
    const serviceKey = path
      .replace(servicesPath, '')
      .replace(/^\//, '')
      .replace(/\.js$/, '')
    const Service = this.nuxt.resolver.requireModule(path) || {}

    Services[serviceKey] = Service
    ServicesMethods[serviceKey] = getServiceMethods(Service)
  })
  /*
  ** Add plugin
  */
  const url = `ws://${this.options.server.host}:${this.options.server.port}`
  this.addPlugin({
    filename: 'services.ws.client.js',
    src: join(__dirname, 'plugins/services.client.js'),
    ssr: false,
    options: {
      url,
      ServicesMethods
    }
  })
  this.addPlugin({
    filename: 'services.ws.server.js',
    src: join(__dirname, 'plugins/services.server.js')
  })
  // TODO: get the context from `server middleware`
  // where @nuxtjs/axios could also instanciate himself
  this.nuxt.hook('vue-renderer:ssr:context', async (ssrContext) => {
    const context = ssrContext

    await this.nuxt.callHook('services:context', context)
    ssrContext.services = loadServices(Services, context)
  })
  /*
   ** Create WS server
   */
  this.nuxt.hook('listen', server => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', async (ws, req) => {
      const context = { req, ws }
      console.log('new connection')
      await this.nuxt.callHook('services:context', context)
      const services = loadServices(Services, context)

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
              let serviceModule = services
              obj.module.split('/').forEach((m) => {
                serviceModule = serviceModule[m]
              })
              data = await serviceModule[obj.method](...obj.args)
            } catch (e) {
              if (this.options.dev) consola.error(e)
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

export class NuxtService {
  constructor ({ services }) {
    this.$services = services
  }
}
