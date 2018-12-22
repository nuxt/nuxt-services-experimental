<template>
  <div>
    <pre>{{ user }}</pre>
    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $services }) {
    const user = await $services.users.get(params.id)

    return { user }
  }
}
</script>
