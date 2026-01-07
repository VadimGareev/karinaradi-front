import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createWebHistory, createRouter } from 'vue-router'
import Catalog from '@/pages/Catalog.vue'
import Home from '@/pages/Home.vue'
import Favorites from '@/pages/Favorites.vue'
import Product from '@/pages/Product.vue'
import Refunds from '@/pages/Refunds.vue'
import Delivery from '@/pages/Delivery.vue'
import About from '@/pages/About.vue'
import Offer from '@/pages/Offer.vue'
import { createPinia } from 'pinia'
import AdminLayout from '@/admin/components/AdminLayout.vue'
import AdminLogin from '@/admin/pages/Login.vue'
import AdminCategories from '@/admin/pages/Categories.vue'
import AdminProducts from '@/admin/pages/Products.vue'
import { useAuthStore } from '@/stores/auth'


const app = createApp(App)
const routes = [
  { path: '/', component: Home },
  { path: '/catalog/:slug?', component: Catalog, name: 'catalog', meta: { title: 'Каталог' } },
  { path: '/product/:id', name: 'product', component: Product, props: true },
  { path: '/favorites', component: Favorites },
  { path: '/refunds', component: Refunds },
  { path: '/delivery', component: Delivery },
  { path: '/about', component: About },
  { path: '/offer', component: Offer },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'categories', component: AdminCategories },
      { path: 'products', component: AdminProducts },
    ],
  },
  { path: '/admin/login', component: AdminLogin },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuth) {
    next('/admin/login')
  } else {
    next()
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'KarinaRadi'
})
app.use(router)
app.use(autoAnimatePlugin)
app.use(createPinia())
app.mount('#app')

