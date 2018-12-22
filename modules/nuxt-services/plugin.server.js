export default (ctx, inject) => {
  if (process.server) {
    inject('services', ctx.req.services)
    ctx.$services = ctx.req.services
  }
}
