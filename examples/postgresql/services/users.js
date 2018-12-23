import consola from 'consola'

export default {
  list() {
    consola.info(this)
    return this.$db.from`users`
  },
  get(id) {
    return this.$db`users`({ id: parseInt(id) }).return`*`
  },
  create(user) {
    user.createdAt = new Date()
    user.updatedAt = new Date()
    return this.$db`users`.insert(user).return`id`
  },
  remove(id) {
    return !!this.$db`users`.delete({ id }).return`id`
  }
}
