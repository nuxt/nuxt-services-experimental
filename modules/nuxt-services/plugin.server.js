export default (ctx, inject) => {
  if (process.server) {
    // This makes user $services from `services/` available
    inject('services', ctx.req.services)
    ctx.$services = ctx.req.services

    // This makes $db, $cache etc available as well
    for (const backend in ctx.req.backends) {
      inject(backend, ctx.req.backends[backend])
      ctx[`$${backend}`] = ctx.req.backends[backend]
    }
  }
}
