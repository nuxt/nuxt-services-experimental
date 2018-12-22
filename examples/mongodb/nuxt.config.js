export default {
  modules: [
    '../../modules/nuxt-mongodb',
    '../../modules/nuxt-services'
  ],
  backends: {
    db: ['mongodb', {
      url: 'mongodb://nuxt-user:nuxt-user3@ds157614.mlab.com:57614/nuxt-users'
    }]
  }
}
