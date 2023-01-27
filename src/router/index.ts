import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    name: 'Root',
    path: '/',
    redirect: '/login',
  },
  {
    name: 'Dashboard',
    path: "/dashboard",
    component: Dashboard,
  },
  {
    name: 'Login',
    path: "/login",
    component: Login,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
