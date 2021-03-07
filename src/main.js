import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTimes, faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";

library.add(faTimes, faPlusCircle, faEdit)

// Tailwind
import './index.css'


// Vue App
createApp(App)
    .use(router)
    .use(Vuex)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
