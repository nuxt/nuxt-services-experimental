
export default {
  list() {
    return this.$db.from`users`
  },
  get(id) {
    return this.$db`users`({ id })
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
