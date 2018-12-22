<template>
  <div>
    <pre>{{ user }}</pre>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $services, $cache }) {
    let user = await $cache.getJSON(`user:${params.id}`)
    if (!user) {
      user = await $cache.users.get(params.id)
      // Cache user for 60 seconds
      await $cache.cache.setJSON(`user:${params.id}`, user, 60)
    }
    return { user }
  }
}
</script>
