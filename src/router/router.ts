import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../components/pages/Auth/SignIn.vue'
import SignUp from '../components/pages/Auth/SignUp.vue'
import Dashboard from '../components/pages/Dashboard/Dashboard.vue'
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
    console.log('Redirect to /login')
    return '/login'
  }

  if (to.meta.guest && isAuthenticated) {
    console.log('Redirect to /')
    return '/'
  }
})

export default router