<template>
<button class="roadmap-node" @click="emitID">
  <div class="type">{{ nodeInfo.data.type.toUpperCase() }}</div>
<div class="node-title">{{ nodeInfo.data.title }}</div>
  <div class="mt-3">{{ nodeInfo.data.description }}</div>
</button>
</template>

<script>
export default {
  name: "Node",
  props: [
      'nodeInfo'
  ],
  emits: [
      'parentId'
  ],
  methods: {
    emitID() {
      this.$emit('parentId', this.nodeInfo.id, this.nodeInfo.depth + 1, false);
    }
  },
  mounted() {
    // console.log(this.nodeInfo);
  }
}
</script>

<style scoped>
.roadmap-node {
  @apply bg-gray-200 rounded-xl text-gray-700 text-xl p-3 mb-3 w-full text-left;
  font-family: 'Open Sans', sans-serif;
  outline: none;
}

.roadmap-node:focus {
  outline: none;
}

.node-title {
  @apply py-3 border-b border-gray-400 text-2xl;
  font-family: 'Fredoka one', sans-serif;
}

.type {
  @apply text-xs text-gray-400;
}
</style>
