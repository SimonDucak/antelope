import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import { onAuthStateChanged } from "firebase/auth";
import { guestRequiredMiddleware, userRequiredMiddleware } from "@/router/middleware";
import { useAuth } from '@/composable/use_auth';

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
    beforeEnter: userRequiredMiddleware,
  },
  {
    name: 'Login',
    path: "/login",
    component: Login,
    beforeEnter: guestRequiredMiddleware,
  }
]

onAuthStateChanged(useAuth().auth, (user) => {
  if (user) router.push({ path: '/dashboard' });
  else router.push({ path: '/login' });
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
