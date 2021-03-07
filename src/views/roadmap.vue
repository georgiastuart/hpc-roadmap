<template>
  <navbar/>
  <div class="flex mt-6">
    <ul v-if="typeof tree[0] !== 'undefined'" class="breadcrumbs">
      <li v-for="p in currentParentList" :key="p.id" @click="getNodes(p.id, p.depth, true)"><button>{{ p.name }}</button></li>
    </ul>
  </div>
  <div class="min-w-full overflow-x-auto mt-6">
    <div v-if="typeof tree[0] !== 'undefined'">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-36">
        <div class="col-span-1 flex flex-col">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 3 : 0].id).entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes"></node>
          </div>
          <button>Add</button>
        </div>
        <div v-if="depth > 0 && currentParentList.length > 1" class="col-span-1">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 2 : 1].id).entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes"></node>
          </div>
        </div>
        <div v-if="depth > 1 && currentParentList.length > 2" class="col-span-1">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 1 : 2].id).entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes"></node>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {db} from '@/firebase'
import Node from "@/components/Node";
import Navbar from "@/components/Navbar";

export default {
  name: "Roadmap",
  components: {
    Node,
    Navbar
  },
  data() {
    return {
      tree: [],
      depth: -1,
      currentParentList: [],
      prevParent: null,
      currentParent: null
    }
  },
  methods: {
    getNodes(parent, depth, includeCurrent) {
      console.log(parent, depth);
      if (this.depth >= 0 && this.depth > depth) {
        this.depth = depth;
        let parentNode = undefined;
        for (let col of this.tree) {
          parentNode = col.entries.find(obj => obj.id === parent);

          if (typeof parentNode !== 'undefined') {
            break;
          }
        }
        if (typeof parentNode === 'undefined') {
          this.getParentList(null, false)
        } else {
          this.getParentList(parentNode, includeCurrent);
        }
      } else {
        this.currentParent = parent;
        this.depth = depth;
        let currentCol = this.tree.find(obj => obj.parent === parent);
        if (typeof currentCol === 'undefined') {
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
                    depth: depth
                  })
                });
                this.tree.push(column);
                if (column.entries.length > 0) {
                  this.getParentList(column.entries[0], includeCurrent);
                } else {
                  this.getParentList({parent: column.parent}, false)
                }
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
        } else {
          this.getParentList(currentCol.entries[0]);
        }
      }
    },

    getParentList(node, includeCurrent) {
      let parentName = undefined;
      let parentId = undefined;
      let parentDepth = undefined;
      this.currentParentList = [{ name: 'Base', depth: 0, id: null }]
      if (includeCurrent) {
        parentName = node.data.title;
        parentId = node.id;
        parentDepth = node.depth;
        for (let col of this.tree) {
          let parentNode = col.entries.find(obj => obj.id === node.parent);
          if (typeof parentNode !== 'undefined') {
            this.getParentList(parentNode, true);
          }
        }
        if (typeof parentName !== 'undefined') {
          this.currentParentList.push({
            name: parentName,
            id: parentId,
            depth: parentDepth + 1
          });
        }
      } else {
        if (node !== null && node.parent !== null) {
          for (let col of this.tree) {
            let parentNode = col.entries.find(obj => obj.id === node.parent);
            console.log('Parent node', parentNode);
            if (typeof parentNode !== 'undefined') {
              parentName = parentNode.data.title;
              parentId = parentNode.id;
              parentDepth = parentNode.depth;
              this.getParentList(parentNode, false);
            }
          }
          if (typeof parentName !== 'undefined') {
            this.currentParentList.push({
              name: parentName,
              id: parentId,
              depth: parentDepth + 1
            });
          }
        }
      }
    }
  },
  mounted() {
    this.getNodes(null, 0);
  }
}
</script>

<style scoped>

.breadcrumbs {
  @apply flex text-gray-400;
  font-family: 'Fredoka one', sans-serif;
}

.breadcrumbs > li:last-child {
  @apply text-gray-600;
}

.breadcrumbs > li {
  @apply pl-1;
}

.breadcrumbs > li:after {
  content: ' / ';
}

.breadcrumbs > li:last-child:after {
  content: '';
}

.breadcrumbs > li > button {
  outline: none;
}

.breadcrumbs > li > button:focus {
  outline: none;
}

</style>
