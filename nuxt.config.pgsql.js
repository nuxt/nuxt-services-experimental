export default {
  modules: [
    '~/modules/nuxt-postgresql',
    '~/modules/nuxt-services'
  ],
  postgresql: {
    url: 'mongodb://localhost:27017',
    dbName: 'my-db'
  }
}
