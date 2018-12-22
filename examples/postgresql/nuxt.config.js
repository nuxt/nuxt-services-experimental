export default {
  modules: [
    '../../modules/nuxt-postgresql',
    '../../modules/nuxt-services'
  ],
  postgresql: {
    connectionString: 'postgresql://user@localhost:5432/dbName'
  }
}
