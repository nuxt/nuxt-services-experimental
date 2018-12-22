
export default {
  list() {
    return this.$db.from`users`
  },
  get(id) {
    return this.$db`users`({ id })
  },
  async create(user) {
    user.createdAt = new Date()
    user.updatedAt = new Date()
    return this.$db`users`.insert(user).return`id`
  },
  async remove(id) {
    return !!this.$db`users`.delete({ id }).return`id`
  }
}
