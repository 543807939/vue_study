import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/add'
  },
  {
    path: '/add',
    component: () => import('../components/Addition.vue')
  },
  {
    path: '/sub',
    component: () => import('../components/Subtraction.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
