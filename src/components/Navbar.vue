<template>
<div class="w-full flex justify-between mb-3 py-5 border-b border-gray-200" id="navbar">
  <h1>The High Performance Computing Roadmap</h1>
  <div class="flex items-center">
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
  @apply text-5xl text-gray-700;
  font-family: 'Unica one', sans-serif;
}

.nav-item {
  @apply text-xl text-gray-600;
  font-family: 'Open Sans', sans-serif;
}
</style>
