import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../components/Signup.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes = [
  { path: '/', redirect: '/signup' },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si un token existe et qu'on va sur /signup ou /login => Redirige vers /home
  if (token && (to.path === '/signup' || to.path === '/login')) {
    next('/home')
  } 
  // Si pas de token et qu'on va sur /home => Redirige vers /signup
  else if (!token && to.path === '/home') {
    next('/login')
  } 
  else {
    next()
  }
})

export default router
