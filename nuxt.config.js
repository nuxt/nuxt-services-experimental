export default {
  modules: [
    '~/modules/nuxt-mongodb',
    '~/modules/nuxt-services'
  ],
  mongodb: {
    // url is required
    url: 'mongodb://localhost:27017',
    dbName: 'my-db'
  }
}
