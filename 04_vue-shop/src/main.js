import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入阿里图标
import './assets/font/iconfont.css'

// 引入全局样式表
import './assets/css/global.css'

import Element from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(res => {
  return res.data
})
Vue.prototype.$http = axios

// 全局配置message
// Vue.prototype.$message = Element.Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
