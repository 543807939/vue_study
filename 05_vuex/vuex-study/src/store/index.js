import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state) {
      state.count += 1
    },
    reduce(state) {
      state.count -= 1
    },
    addN(state, step) {
      state.count += step
    },
    reduceN(state, step) {
      state.count -= step
    }
  },
  actions: {
    addAsync(context, step) {
      setTimeout(() => {
        context.commit('addN', step ? step - 0 : 1)
      }, 1000);
    },
    reduceAsync(context, step) {
      setTimeout(() => {
        context.commit('reduceN', step ? step - 0 : 1)
      }, 1000);
    }
  },
  getters: {
    showNum(state) {
      return `当前值为${state.count}`
    }
  },
  modules: {
  }
})
