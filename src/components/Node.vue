<template>
  <div class="roadmap-node">
    <div class="flex justify-between items-center">
      <div class="type">{{ nodeInfo.data.type.toUpperCase() }}</div>
      <button class="edit-btn">
        <font-awesome-icon icon="edit" @click="editNode"></font-awesome-icon>
      </button>
    </div>
    <div class="roadmap-node-body" @click="emitID">
      <div class="node-title">{{ nodeInfo.data.title }}</div>
      <div class="mt-3">{{ nodeInfo.data.description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Node",
  props: [
    'nodeInfo'
  ],
  emits: [
    'parentId',
    'nodeEditInfo'
  ],
  methods: {
    emitID() {
      this.$emit('parentId', this.nodeInfo.id, this.nodeInfo.depth + 1, false);
    },

    editNode() {
      this.$emit('nodeEditInfo', this.nodeInfo);
    }
  },
  mounted() {
    // console.log(this.nodeInfo);
  }
}
</script>

<style scoped>
.roadmap-node {
  @apply bg-gray-100 rounded-xl text-gray-700 text-xl p-3 mb-3 w-full text-left;
  font-family: 'Open Sans', sans-serif;
  outline: none;
}

.roadmap-node:focus {
  outline: none;
}

.roadmap-node-body {
  cursor: pointer;
}

.node-title {
  @apply py-3 border-b border-gray-400 text-2xl;
  font-family: 'Fredoka one', sans-serif;
}

.type {
  @apply text-xs text-gray-400;
}

.edit-btn {
  @apply text-xs text-gray-400 p-2;
  outline: none;
}

.edit-btn:focus {
  outline: none;
}
</style>
