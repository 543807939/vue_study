import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: '',
    // 下一个节点的id
    nextId: 5,
    currentKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为store中的inputValue赋值
    setInputValue(state, value) {
      state.inputValue = value
    },
    // 将inputValue添加到list中
    addItemToList(state, task) {
      if (state.inputValue) {
        let obj = {
          id: state.nextId,
          info: task,
          done: false
        }
        this.state.list.push(obj)
        state.nextId++
        state.inputValue = ''
      }
    },
    // 根据id删除list中的元素
    removeItemById(state, id) {
      let index = state.list.findIndex(item => item.id == id)
      state.list.splice(index, 1)
    },
    // 根据id修改状态
    changeItemStatusById(state, params) {
      let index = state.list.findIndex(item => item.id == params.id)
      if (index !== -1) {
        state.list[index].done = params.status
      }
    },
    // 清除已完成的数据
    clean(state) {
      state.list = state.list.filter(item => item.done == false)
    },
    // 改变当前的视图状态
    changeCurrentKey(state, key) {
      state.currentKey = key
    }
  },
  actions: {
    async getList(context) {
      let {
        data
      } = await axios.get('/list.json')
      context.commit('initList', data)
    }
  },
  getters: {
    restNum(state) {
      return state.list.filter(item => item.done == false).length
    },
    infoList(state) {
      if (state.currentKey == 'all') {
        return state.list
      } else if (state.currentKey == 'undone') {
        return state.list.filter(item => item.done == false)
      } else {
        return state.list.filter(item => item.done == true)
      }
    }
  },
  modules: {}
})
