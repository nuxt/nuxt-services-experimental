<template>
  <div>
    <div v-for="user in users" :key="user._id">
      <pre>{{ user }}</pre>
      <nuxt-link :to="`/users/${user.id}`">See user</nuxt-link>
      <button @click="removeUser(user.id)">X</button>
    </div>
    <button @click="addUser">Add user</button>
  </div>
</template>

<script>
export default {
  async asyncData({ $services }) {
    const users = await $services.users.list()

    return { users }
  },
  methods: {
    async addUser() {
      const user = await this.$services.users.create({
        username: 'Atinux',
        name: 'Sebastien Chopin'
      })
      this.users.push(user)
    },
    async removeUser(id) {
      await this.$services.users.remove(id)
      this.users = this.users.filter(user => user.id !== id)
    }
  }
}
</script>
