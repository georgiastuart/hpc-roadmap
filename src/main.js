import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add()

// Tailwind
import './index.css'

createApp(App)
    .use(router)
    .use(Vuex)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
