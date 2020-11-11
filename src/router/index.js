import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/Home.vue')
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path === '/login') {
    next()
  } else {
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) {
      next('/login')
    } else {
      next()
    }
  }
})
export default router
