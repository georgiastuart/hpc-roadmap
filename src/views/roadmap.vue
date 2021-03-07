<template>
  <h1 class="text-center my-3 pb-3 border-b border-gray-200">The High Performance Computing Roadmap</h1>
  <div class="min-w-full overflow-x-auto mt-6">
    <div v-if="typeof tree[0] !== 'undefined'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-36">
        <div class="col-span-1 flex flex-col">
          <div   v-for="info of tree.filter(obj => obj.parent === prevParent)[0].entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes"></node>
          </div>
          <button>Add</button>
        </div>
        <div v-if="depth > 0 && typeof tree.filter(obj => obj.parent === currentParent)[0] !== 'undefined'" class="col-span-1">
          <div   v-for="info of tree.filter(obj => obj.parent === currentParent)[0].entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes"></node>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import Node from "@/components/Node";

export default {
  name: "Roadmap",
  components: {
    Node
  },
  data() {
    return {
      tree: [],
      depth: 0,
      prevParent: null,
      currentParent: null
    }
  },
  methods: {
    getNodes(parent, depth) {
      this.currentParent = parent;
      this.depth = depth + 1;
      // console.log(parent, this.depth, this.tree.filter(obj => obj.parent === parent));
      if (this.tree.filter(obj => obj.parent === parent).length === 0) {
        let column = {
          parent: parent,
          entries: []
        };
        db.collection('roadmap')
            .where('parent', '==', parent)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                column.entries.push({
                  parent: parent,
                  id: doc.id,
                  data: doc.data(),
                  depth: depth + 1
                })
              });
              this.tree.push(column);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
      }
    }
  },
  mounted() {
    this.getNodes(null, -1);}
}
</script>

<style scoped>
h1 {
  @apply text-5xl text-gray-600;
  font-family: 'Fredoka one', sans-serif;
}
</style>
