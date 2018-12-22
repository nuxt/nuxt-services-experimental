<template>
  <div>
    <pre>{{ user }}</pre>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $services }) {
    let user = await $services.cache.getJSON(`user:${params.id}`)
    if (!user) {
      user = await $services.users.get(params.id)
      // Cache user for 60 seconds
      await $services.cache.setJSON(`user:${params.id}`, user, 60)
    }
    return { user }
  }
}
</script>
