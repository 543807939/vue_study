<template>
  <div>
    <h3>当前最新count值为:{{$store.state.count}}</h3>
    <input type="text" v-model="step" />
    <button @click="add">+1/N</button>
    <button @click="addAsync">+1/N Async</button>
    <h4>{{count}}</h4>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      step: '',
    }
  },
  methods: {
    add() {
      if (this.step) {
        return this.$store.commit('addN', this.step - 0)
      }
      // commit用来触发 mutation
      this.$store.commit('add')
    },
    addAsync() {
      // dispatch 触发action
      this.$store.dispatch('addAsync', this.step)
    },
  },
  computed: {
    ...mapState(['count']),
  },
}
</script>