import { createRouter, createWebHistory } from 'vue-router'
import roadmap from "@/views/roadmap";

const routes = [
  {
    path: '/',
    name: 'HPC Roadmap',
    component: roadmap
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
