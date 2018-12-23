export default (ctx, inject) => {
  if (process.server) {
    // This makes user $services from `services/` available
    inject('services', ctx.req.services)
    ctx.$services = ctx.req.services
  }
}
