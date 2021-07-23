import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: () => import(/* webpackChunkName: "group-login_home_welcome" */'../components/Login.vue')
}, {
  path: '/home',
  component: () => import(/* webpackChunkName: "group-login_home_welcome" */'../components/Home.vue'),
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: () => import(/* webpackChunkName: "group-login_home_welcome" */'../components/Welcome.vue'),
  }, {
    path: '/users',
    component: () => import(/* webpackChunkName: "group-users" */'../components/user/User.vue')
  }, {
    path: '/rights',
    component: () => import(/* webpackChunkName: "group-users" */'../components/power/Rights.vue')
  }, {
    path: '/roles',
    component: () => import(/* webpackChunkName: "group-users" */'../components/power/Roles.vue')
  }, {
    path: '/categories',
    component: () => import(/* webpackChunkName: "group-categories" */'../components/goods/Cate.vue')
  }, {
    path: '/params',
    component: () => import(/* webpackChunkName: "group-categories" */'../components/goods/Params.vue')
  }, {
    path: '/goods',
    component: () => import(/* webpackChunkName: "group-goods" */'../components/goods/List.vue'),
  }, {
    path: '/goods/add',
    component: () => import(/* webpackChunkName: "group-goods" */'../components/goods/Add.vue')
  }, {
    path: '/orders',
    component: () => import(/* webpackChunkName: "group-goods" */'../components/order/Order.vue')
  }, {
    path: '/reports',
    component: () => import(/* webpackChunkName: "group-reports" */'../components/report/Report.vue')
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
