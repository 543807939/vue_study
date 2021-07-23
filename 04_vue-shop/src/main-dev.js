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

// 引入vue-table-with-tree-grid
import ZKTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZKTable)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 引入 nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(res => {
  NProgress.done();
  return res
})
Vue.prototype.$http = axios

// 全局配置message
// Vue.prototype.$message = Element.Message

// 注册时间过滤器
Vue.filter('dateFormat', (date) => {
  let time = new Date(date)
  return `${(time.getFullYear() + '').padStart(2, 0)}-${(time.getMonth() + 1 + '0').padStart(2, 0)}-${(time.getDate() + '').padStart(2, 0)} ${(time.getHours() + '').padStart(2, 0)}:${(time.getMinutes() + '').padStart(2, 0)}:${(time.getSeconds() + '').padStart(2, 0)}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
