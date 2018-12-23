
export default {
  list() {
    return this.$db`users`
  },
  async get(id) {
    let user = await this.$cache.getJSON(`user:${id}`)
    if (!user) {
      user = await this.$db`users`({ id: parseInt(id) }).return`*`
      await this.$cache.setJSON(`user:${id}`, user, 60)
    }
    return user
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
