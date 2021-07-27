 <template>
  <div>
    <my-addition></my-addition>
    <my-subtraction></my-subtraction>
    <h3>hello,world.</h3>
    <button @click="toAdd">我要去加</button>
    <button @click="toReduce">我要去减</button>
    <router-view></router-view>
  </div>
</template>
<script>
import Additon from './components/Addition.vue'
import Subtraction from './components/Subtraction.vue'
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
  components: {
    'my-addition': Additon,
    'my-subtraction': Subtraction,
  },
}
</script>
