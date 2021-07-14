import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: () => import('../components/Login.vue')
}, {
  path: '/home',
  component: () => import('../components/Home.vue'),
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: () => import('../components/Welcome.vue'),
  }, {
    path: '/users',
    component:()=>import('../components/user/User.vue')
  }]
}]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径  from 从哪个路径来
  // next() 放行函数, next() 放行 next(path)强制跳转
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
