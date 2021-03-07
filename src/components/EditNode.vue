<template>
  <div class="overlay"></div>
  <div class="modal-container">
    <div class="modal">
      <div class="flex justify-between items-center modal-title">
        <div v-if="edit" class="">Edit {{ title }}</div>
        <div v-else>Add New Node</div>

<!--        <button class="exit-button"><font-awesome-icon icon="times"></font-awesome-icon></button>-->
      </div>
      <div class="modal-body">
        {{ activeNode }}
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

function initialState() {

}
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
  watch: {
    activeNode: {
      handler: function() {
        console.log('In watcher');
      },
      deep: true
    }
  },
  emits: ['closeModal'],
  data() {
    return {
      activeNode: this.nodeToEdit,
      nodeTitle: '',
      nodeParent: '',
      nodeId: '',
      nodeDescription: '',
      nodeType: 'Category',
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

    },

    cancel() {
      this.closeModal();
      Object.assign(this.$data, initialState());
    },
    save() {
      this.closeModal();
    }
  }
}
</script>

<style scoped>

.overlay {
  @apply bg-gray-400 opacity-75 w-full h-full absolute top-0 left-0;
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
  @apply bg-red-100;
}

.save-button {
  @apply bg-green-100;
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
