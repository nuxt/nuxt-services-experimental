export default async (ctx, inject) => {
  if (process.server) {
    inject('services', ctx.ssrContext.services)
    ctx.$services = ctx.ssrContext.services
  }
}
