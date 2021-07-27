<template>
  <div>
    <h3>当前最新count值为:{{this.$store.state.count}}</h3>
    <input type="text" v-model="step" />
    <button @click="sub">-1/N</button>
    <button @click="reduceAsync(step)">-1/N Async</button>
    <h3>{{$store.getters.showNum}}</h3>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      step: '',
    }
  },
  methods: {
    sub() {
      if (this.step) {
        return this.$store.commit('reduceN', this.step - 0)
      }
      this.$store.commit('reduce')
    },
    ...mapActions(['reduceAsync']),
  },
}
</script>