import { NuxtService } from '../modules/nuxt-services'
import Cookies from 'cookies'

export default class AuthService extends NuxtService {
  // Constructor is called once on server side and kept alive with socket
  constructor(ctx) {
    super(ctx)
    const { ws, req } = ctx
    // this.$axios = $axios
    // this.$axios = $axios
    const cookies = Cookies(req)

    // Get jwt cookie
    const jwt = cookies.get('jwt')
    this.$axios.setToken(jwt, 'Bearer')
  }

  async getUser (req, res) {
    // Check if JWT is good
    try {
      // TODO
      const user = await this.$services.me.show()
      // Set expiration in 3 months
      const expires = new Date()
      expires.setMonth(expires.getMonth() + 3)
      // TODO: Find a way to set cookie from WS
      // Update jwt cookie
      cookies.set('jwt', user.token, {
        expires,
        httpOnly: true
      })
      delete user.token

      return user
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // cookies.set('jwt') // Remove jwt cookie
        // Find a way to remove cookie from WS?
        this.$axios.setToken(false)
      }
    }
  }
}
