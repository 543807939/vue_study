import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式表
import './assets/css/global.css'

import Element from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
