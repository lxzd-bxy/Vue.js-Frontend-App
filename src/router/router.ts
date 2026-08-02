import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../components/pages/auth/SignIn.vue'
import SignUp from '../components/pages/auth/SignUp.vue'
import Dashboard from '../components/pages/dashboard/Dashboard.vue'
import { useAuthStore } from '../stores/authStore.ts'

const routes = [
  { path: '/login', component: SignIn, meta: { guest: true } },
  { path: '/signup', component: SignUp, meta: { guest: true } },
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  console.log('Navigating to:', to.path, 'isAuthenticated:', isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.guest && isAuthenticated) {
    return '/'
  }
})

export default router