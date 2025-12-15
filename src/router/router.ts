import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '../components/pages/Home/Home.vue'
import Catalog from '../components/pages/Catalog/Catalog.vue'
import About from '../components/pages/About/About.vue'
import Reviews from '../components/pages/Reviews/Reviews.vue'
import Contacts from '../components/pages/Contacts/Contacts.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Catalog', component: Catalog },
  { path: '/About', component: About },
  { path: '/Reviews', component: Reviews},
  { path: '/Contacts', component: Contacts },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
