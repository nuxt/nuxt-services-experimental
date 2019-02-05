const filterPublicMethods = (Service) => (m) => {
  if (m[0] === '_' || m === 'constructor') return false
  if (typeof Service[m] !== 'function') return false

  return true
}

export function getServiceMethods(Service) {
  const methods = Object.getOwnPropertyNames(Service.prototype).filter(filterPublicMethods(Service.prototype))

  // Later on if extends NuxtService
  // const ParentService = Object.getPrototypeOf(Service.prototype)
  // const parentMethods = Object.getOwnPropertyNames(ParentService).filter(filterPublicMethods(ParentService))
  // methods = methods.concat(parentMethods).unique()?

  return methods
}

export function loadServices(Services, ssrContext) {
  let services = {}

  // For each Service, instanciate it
  Object.keys(Services).forEach((serviceNamespace) => {
    let s = services
    const keys = serviceNamespace.split('/')

    keys.forEach((key, i) => {
      if (i + 1 < keys.length) {
        s[key] = s[key] || {}
        s = s[key]
        return
      }
      // Expose every public methods of the service instance definition
      const Service = Services[serviceNamespace]
      s[key] = new Service({ ...ssrContext, services })
    })
  })

  return services
}
