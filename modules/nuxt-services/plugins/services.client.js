import devalue from '@nuxtjs/devalue'

class ClientRPC {
  constructor() {
    this.ws = null
    this.challenge = 0
    this.autoReconnectInterval = 2000 // 1 second
    this.returns = new Map()
    this.connected = false
    this.connect()
  }

  connect() {
    this.ws = new WebSocket('<%= options.url %>')
    this.ws.onopen = () => {
      this.connected = true
    }
    this.ws.onclose = (e) => {
      this.connected = false
      switch (e.code){
        case 1000: // CLOSE_NORMAL
          // console.log('WebSocket: closed')
          break;
        default: // Abnormal closure
          this.reconnect(e)
          break;
      }
    }
    this.ws.onerror = (e) => {
      switch (e.code){
        case 'ECONNREFUSED':
          this.reconnect(e)
          break;
        default:
          // TODO: call service error handler ($services.on('error', ...))
          break;
        }
    }
    this.ws.onmessage = this.onMessage.bind(this)
  }

  reconnect(e) {
    // console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e)
    setTimeout(() => {
      // console.log('WebSocketClient: reconnecting...')
      this.connect()
    }, this.autoReconnectInterval)
  }

  onMessage(msg) {
    let obj

    try {
      obj = (0, eval)(`(${msg.data})`)
    } catch(e) {
      console.error('Error', e, data.data)
      return
    }
    switch (obj.action) {
      case 'return':
        if (obj.challenge) {
          const [resolve, reject] = this.returns.get(obj.challenge)
          if (obj.error && reject) {
            reject(obj.error)
          }
          if (resolve) {
            resolve(obj.data)
          }
          this.returns.delete(obj.challenge)
        }
      break;
      default:
    }
  }
  async callMethod(module, name, ...args) {
    if (!this.connected) {
      // console.log('WS not connected, retrying in a sec...')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return this.callMethod(module, name, ...args)
    }

    const payload = {
      action: 'call',
      module,
      method: name,
      args: args,
      challenge: ++this.challenge
    }

    const data = new Promise((resolve, reject) => this.returns.set(this.challenge, [resolve, reject]))

    this.ws.send(devalue(payload))

    return data
  }
}

export default async (ctx, inject) => {
  const services = new ClientRPC()

  <% Object.keys(options.ServicesMethods).forEach((moduleNamespace) => {
    const methods = options.ServicesMethods[moduleNamespace]

    const modules = []
    moduleNamespace.split('/').forEach((m) => {
      modules.push(m)
      const module = modules.map((m) => `['${m}']`).join('') %>
  services<%= module %> = services<%= module %> || {}<%
    })
    methods.forEach((method) => {
      const module = modules.concat(method).map((m) => `['${m}']`).join('') %>
  services<%= module %> = services.callMethod.bind(services, '<%= moduleNamespace %>', '<%= method %>')<%
    })
  }) %>
  inject('services', services)
  ctx.$services = services
}
