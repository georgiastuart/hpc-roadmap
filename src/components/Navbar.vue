<template>
<div class="w-full flex justify-between my-3 pb-3 border-b border-gray-200">
  <h1>The High Performance Computing Roadmap</h1>
  <div class="flex items-center">
    <div class="nav-item pr-5">Roadmap</div>
    <div class="nav-item pr-5">Checklist</div>
    <div class="nav-item">Log In</div>
  </div>
</div>
</template>

<script>
export default {
name: "Navbar"
}
</script>

<style scoped>
h1 {
  @apply text-5xl text-gray-600;
  font-family: 'Fredoka one', sans-serif;
}

.nav-item {
  @apply text-xl text-gray-600;
  font-family: 'Open Sans', sans-serif;
}
</style>
