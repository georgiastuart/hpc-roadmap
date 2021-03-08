<template>
  <div class="overlay"></div>
  <div class="modal-container">
    <div class="modal">
      <div class="flex justify-between items-center modal-title">
        <div v-if="edit" class="">Edit {{ title }}</div>
        <div v-else>Add New Node</div>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-label">Title</div> <input class="form-input" v-model="nodeTitle" placeholder="Node Title" />
        </div>
        <div class="form-row">
          <div class="form-label">Description</div> <textarea class="form-input" v-model="nodeDescription" placeholder="Node Description"></textarea>
        </div>
        <div class="form-row">
          <div class="form-label">Node Type</div>
          <select class="form-dropdown" v-model="nodeType">
            <option disabled value="">Please select a type</option>
            <option>Category</option>
            <option>Endpoint</option>
          </select>
        </div>
        <div v-for="index in nodeLinkTitles.length" :key="index" class="form-row">
          <div class="flex flex-col flex-grow">
            <div class="form-label">Link #{{ index }}</div>
            <div class="flex pb-2 items-center">
              <div class="pl-10 form-label">Link #{{ index }} Title</div>
              <input class="form-input" v-model="nodeLinkTitles[index]" :placeholder="'Link #' + index + ' title'">
            </div>
            <div class="flex pb-2 items-center">
              <div class="pl-10 form-label">Link #{{ index }} URL</div>
              <input class="form-input" v-model="nodeLinkURLS[index]" :placeholder="'Link #' + index + ' URL'">
            </div>
            <div class="flex items-center">
              <div class="pl-10 form-label">Link #{{ index }} Description</div>
              <textarea class="form-input" v-model="nodeLinkURLS[index]" :placeholder="'Link #' + index + ' Description'" />
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <button @click="addLinkRow" class="btn"><font-awesome-icon icon="plus-circle"></font-awesome-icon> Add New Link</button>
        </div>
      </div>
      <div class="modal-close-buttons">
        <button class="btn cancel-button" @click="cancel">Cancel</button>
        <button class="btn save-button" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import clonedeep from 'lodash.clonedeep';

export default {
  name: "EditNode",
  props: {
    edit: {
      default: true
    },
    title: {
      default: 'card'
    },
    nodeToEdit: {
      default: {}
    }
  },

  emits: ['closeModal', 'updated'],

  data() {
    return {
      activeNode: this.nodeToEdit,
      nodeTitle: '',
      nodeParent: null,
      nodeId: null,
      nodeDescription: '',
      nodeType: 'Category',
      nodeLinks: [],
      nodeLinkTitles: [''],
      nodeLinkURLS: [''],
      nodeLinkDescriptions: ['']
    }
  },
  methods: {
    addLinkRow() {
      this.nodeLinkTitles.push('');
      this.nodeLinkURLS.push('');
      this.nodeLinkDescriptions.push('');
    },
    closeModal() {
      console.log("closing modal");
      this.$emit('closeModal', true);
    },

    openModal() {
      if (this.activeNode !== null) {
          this.nodeTitle = this.activeNode.data.title;
          this.nodeParent = this.activeNode.data.parent;
          this.nodeId = this.activeNode.id;
          this.nodeDescription = this.activeNode.data.description;
          this.nodeType = this.activeNode.data.type;
          this.nodeType = this.nodeType.charAt(0).toUpperCase() + this.nodeType.slice(1);
          if (this.activeNode.data.links !== null) {
            this.nodeLinkTitles = [];
            this.nodeLinkURLS = [];
            this.nodeLinkDescriptions = [];
            for (let link of this.activeNode.data.links) {
              this.nodeLinkTitles.push(link.title);
              this.nodeLinkDescriptions.push(link.description);
              this.nodeLinkURLS.push(link.url);
            }
          }
      }
    },

    cancel() {
      this.closeModal();
    },

    save() {
      for (let index in this.nodeLinkTitles.length) {
        this.nodeLinks.push({
          title: this.nodeLinkTitles[index],
          url: this.nodeLinkURLS[index],
          description: this.nodeLinkDescriptions[index]
        })
      }

      if (this.nodeId !== null) {
        db.collection("roadmap")
            .doc(this.nodeId)
            .set({
              title: this.nodeTitle,
              description: this.nodeDescription,
              links: this.nodeLinks,
              type: this.nodeType
            }, { merge: true })
            .then(() => {
              console.log("Updated " + this.nodeTitle + " record.");
              let newNode = clonedeep(this.activeNode);
              newNode.title = this.nodeTitle;
              newNode.description = this.nodeDescription;
              newNode.links = this.nodeLinks;
              newNode.type = this.nodeType;
              this.$emit('updated', newNode);
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
      }

      this.closeModal();
    }
  },

  mounted() {
    this.openModal();
  }
}
</script>

<style scoped>

.overlay {
  @apply bg-gray-400 opacity-75 w-full h-full min-h-screen absolute top-0 left-0;
}

.modal-container {
  @apply absolute w-screen h-screen flex justify-center items-center top-0 left-0;
}

.modal {
  @apply bg-white w-3/4 h-3/4 rounded-2xl p-5 md:p-10 flex flex-col;
}

.modal-title {
  @apply text-3xl pb-3 mb-5 border-b border-gray-200;
  font-family: 'Fredoka one', sans-serif;
}

.modal-body {
  @apply flex-grow overflow-auto;
}

.exit-button {
  outline: none;
}

.exit-button:focus {
  outline: none;
}

.form-row {
  @apply flex items-center mb-5;
}

.form-label {
  @apply text-xl mr-5;
  font-family: 'Fredoka one', sans-serif;
}

.form-input {
  @apply border border-gray-200 rounded p-1 flex-grow;
  font-family: 'Open Sans', sans-serif;
}

.modal-close-buttons {
  @apply flex justify-end pt-3 border-t border-gray-200;
}

.btn {
  @apply p-3 m-2 rounded-lg;
  font-family: 'Fredoka one', sans-serif;
  outline: none;
}

.btn:focus {
  outline: none;
}

.cancel-button {
  @apply bg-red-600 text-white;
}

.save-button {
  @apply bg-green-600 text-white;
}

.form-dropdown {
  @apply p-3 rounded-lg bg-gray-200;
  font-family: 'Open Sans', sans-serif;
  outline: none;
}

.form-dropdown:focus {
  outline: none;
}

</style>
