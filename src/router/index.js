import Vue from 'vue'
import VueRouter from 'vue-router'
import Todo from '../views/Todo.vue'
import Login from '../views/Login.vue'
import goTo from 'vuetify/es5/services/goto'
// test
import store from '../store' 
// new test

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import(/* webpackChunkName: "todo" */ '../views/Todo.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const protectedPath = to.matched.some(record => record.meta.requireAuth) 
  if (protectedPath && store.state.token === '') {
    next({ name: 'Login' })
  }
  else {
    // console.log('next')
    document.title = `${process.env.VUE_APP_TITLE} - ${ to.name }`
    next()
  }

})

router.afterEach((to, from) => {
  goTo(0, { duration: 0 })
})

export default router
