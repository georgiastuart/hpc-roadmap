<template>
  <div class="container mx-auto relative">
  <navbar/>
  <div class="w-full h-full min-h-screen absolute">
    <svg xmlns="http://www.w3.org/2000/svg" id="svg-canvas" class="w-full h-full min-h-screen">
      <g fill="transparent" stroke="gray" stroke-width="5">
        <path v-for="connector in connectorList" :key="connector" :id="connector"/>
      </g>
    </svg>
  </div>
  <div class="flex mt-6 z-10 relative">
    <ul v-if="typeof tree[0] !== 'undefined'" class="breadcrumbs">
      <li v-for="p in currentParentList" :key="p.id" @click="getNodes(p.id, p.depth, true)"><button>{{ p.name }}</button></li>
    </ul>
  </div>
  <div class="min-w-full overflow-x-auto mt-6 relative">
    <div v-if="typeof tree[0] !== 'undefined'">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-36">
        <div class="col-span-1 flex flex-col">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 3 : 0].id).entries" :key="info.data.title + info.data.description">
            <node v-bind:node-info="info" @parent-id="getNodes" @node-edit-info="editNode"></node>
          </div>
        </div>
        <div v-if="depth > 0 && currentParentList.length > 1" class="col-span-1">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 2 : 1].id).entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes" @node-edit-info="editNode"></node>
          </div>
        </div>
        <div v-if="depth > 1 && currentParentList.length > 2 && typeof tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 1 : 2].id) !== 'undefined'" class="col-span-1">
          <div v-for="info of tree.find(obj => obj.parent === currentParentList[currentParentList.length >= 3 ? currentParentList.length - 1 : 2].id).entries" :key="info.data.title">
            <node v-bind:node-info="info" @parent-id="getNodes" @node-edit-info="editNode"></node>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <edit-node v-if="!hideEdit" v-bind:node-to-edit="nodeToEdit" @close-modal="setEditModalVisibility" @updated="updateNode"/>
</template>

<script>
import {db} from '@/firebase'
import Node from "@/components/Node";
import Navbar from "@/components/Navbar";
import EditNode from "@/components/EditNode";

export default {
  name: "Roadmap",
  components: {
    Node,
    Navbar,
    EditNode
  },
  data() {
    return {
      tree: [],
      depth: -1,
      currentParentList: [],
      hideEdit: true,
      nodeToEdit: null,
      connectorList: []
    }
  },

  // watch: {
  //   currentParentList: {
  //     handler: function () {
  //       this.getConnectorConfigs();
  //       for (let connector of this.connectorList) {
  //         this.drawConnector(connector);
  //       }
  //     },
  //     deep: true
  //   },
  //   tree: {
  //     handler: function () {
  //       this.getConnectorConfigs();
  //       for (let connector of this.connectorList) {
  //         this.drawConnector(connector);
  //       }
  //     },
  //     deep: true
  //   },
  // },

  methods: {
    setEditModalVisibility(value) {
      this.hideEdit = value
      this.nodeToEdit = null
    },

    getNodes(parent, depth, includeCurrent) {
      console.log(parent, depth);
      if (this.depth >= 0 && this.depth > depth && typeof this.tree.find(obj => obj.id === parent) !== 'undefined') {
        this.depth = depth + 1;
        let parentNode = undefined;
        for (let col of this.tree) {
          parentNode = col.entries.find(obj => obj.id === parent);


          if (typeof parentNode !== 'undefined') {
            break;
          }
        }
        console.log('ParentNode', parentNode);
        if (typeof parentNode === 'undefined') {
          this.getParentList(null, true)
        } else {
          this.getParentList(parentNode, true);
        }

        this.$nextTick(() => {
          this.drawConnectors();
        })
      } else {
        this.depth = depth + 1;
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
                this.$nextTick(() => {
                  this.drawConnectors();
                })
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
        } else {
          this.getParentList(currentCol.entries[0]);
        }
      }

      this.$nextTick(() => {
        this.drawConnectors();
      })
    },

    updateNode(node) {
      for (let col of this.tree) {
        let oldNodeIndex = col.entries.findIndex(obj => obj.id === node.id);

        if (oldNodeIndex !== -1) {
          console.log('Updating ' + col.entries[oldNodeIndex] + " to " + node);
          col.entries[oldNodeIndex] = node;
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
        if (typeof node !== 'undefined' && node !== null && node.parent !== null) {
          for (let col of this.tree) {
            let parentNode = col.entries.find(obj => obj.id === node.parent);
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
    },

    editNode(node) {
      console.log('editing node ', node);
      this.nodeToEdit = node;
      this.hideEdit = false;
    },

    getConnectorConfigs() {
      this.connectorList = [];

      if (this.currentParentList.length > 0) {
        for (let parent of this.currentParentList.slice().reverse()) {
          if (parent.id !== null) {
            let col = this.tree.find(obj => obj.parent === parent.id)

            for (let child of col.entries) {
              this.connectorList.push(parent.id + '-' + child.id);
            }
          }
        }
      }
    },

    drawConnector(connector) {
      let arr = connector.split('-')
      // console.log("Connector array", arr);
      let parentDiv = document.getElementById(arr[0]);
      let childDiv = document.getElementById(arr[1]);
      let arrowDiv = document.getElementById(connector);
      let header = document.getElementById('navbar');

      // console.log(parentDiv, childDiv, arrowDiv);
      if (parentDiv !== null && childDiv !== null && arrowDiv !== null) {
        let startPos = {
          x: parentDiv.offsetLeft + parentDiv.offsetWidth,
          y: parentDiv.offsetTop + Math.floor(0.5 * parentDiv.offsetHeight) + header.offsetHeight
        };

        let endPos = {
          x: childDiv.offsetLeft,
          y: childDiv.offsetTop + Math.floor(0.5 * childDiv.offsetHeight) + header.offsetHeight
        }

        let midPos1 = {
          x: Math.floor((startPos.x + endPos.x) / 2),
          y: startPos.y
        }

        let midPos2 = {
          x: Math.floor((startPos.x + endPos.x) / 2),
          y: endPos.y
        }

        let connectorString =
            "M " + startPos.x + " " + startPos.y +
            " C " + midPos1.x + " " + midPos1.y +
            ", " + midPos2.x + " " + midPos2.y +
            ", " + endPos.x + " " + endPos.y;

        arrowDiv.setAttribute("d", connectorString);
      }
    },

    drawConnectors() {
      this.getConnectorConfigs();
      this.$nextTick(() => {
        for (let connector of this.connectorList) {
          this.drawConnector(connector);
        }
      })
    }
  },
  mounted() {
    this.getNodes(null, 0);
    window.addEventListener('resize', this.drawConnectors)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.drawConnectors)
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
