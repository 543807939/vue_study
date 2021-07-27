import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: 'aa'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为store中的inputValue赋值
    setInputValue(state, value) {
      state.inputValue = value
    }
  },
  actions: {
    async getList(context) {
      let { data } = await axios.get('/list.json')
      context.commit('initList', data)
    }
  },
  modules: {
  }
})
