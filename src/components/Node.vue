<template>
  <div v-bind:class="{ 'roadmap-node': true, 'node-active': active }" :id="nodeInfo.id">
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
    'nodeInfo',
    'active'
  ],
  emits: [
    'parentId',
    'nodeEditInfo'
  ],
  methods: {
    emitID() {
      // console.log('In emit', this.nodeInfo.id, this.nodeInfo.depth);
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
  @apply bg-gray-100 border-2 border-gray-100 rounded-xl text-gray-700 text-xl p-5 mb-5 w-full text-left;
  font-family: 'Open Sans', sans-serif;
  outline: none;
}

.roadmap-node:focus {
  outline: none;
}

.roadmap-node-body {
  cursor: pointer;
}

.node-active {
  @apply  border-2 border-gray-700;
}

.node-title {
  @apply py-3 border-b border-gray-400 text-2xl text-gray-700;
  font-family: 'Fredoka one', sans-serif;
}

.type {
  @apply text-sm text-gray-500;
  font-family: 'Unica one', cursive;
}

.edit-btn {
  @apply text-lg text-gray-500;
  outline: none;
}

.edit-btn:focus {
  outline: none;
}
</style>
