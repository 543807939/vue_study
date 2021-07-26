 <template>
  <div>
    <h3>hello,world.</h3>
    <button @click="toAdd">我要去加</button>
    <button @click="toReduce">我要去减</button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    toAdd() {
      this.$router.push('/add')
    },
    toReduce() {
      this.$router.push('/sub')
    },
  },
}
</script>
