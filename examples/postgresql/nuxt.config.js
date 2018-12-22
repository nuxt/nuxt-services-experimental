export default {
  modules: [
    '../../modules/nuxt-postgresql',
    '../../modules/nuxt-services'
  ],
  backends: {
    db: ['postgresql', {
      connectionString: 'postgres://xegxblez:8TNSEwUTbGA3756-11dis2RsE0c0cFTV@baasu.db.elephantsql.com:5432/xegxblez'
    }]
  }
}
