
<template>
  <div id="app">
    <a-input
      placeholder="请输入任务"
      :value="inputValue"
      @change="inputValueChange"
      class="my_ipt"
    />
    <a-button type="primary" @click="addItemToList">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox
          :checked="item.done"
          @change="checkboxStatusChanged($event, item.id)"
          >{{ item.info }}</a-checkbox
        >
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{$store.getters.restNum}}条剩余</span>
        <span>{{restNum}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="currentKey=='all'?'primary':''" @click="changeList('all')">全部</a-button>
          <a-button :type="currentKey=='undone'?'primary':''" @click="changeList('undone')">未完成</a-button>
          <a-button :type="currentKey=='done'?'primary':''" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState,mapGetters } from "vuex";
export default {
  name: "app",
  data() {
    return {
      active:'all'
    };
  },
  computed: {
    ...mapState([ "inputValue","currentKey"]),
    ...mapGetters(['restNum','infoList'])
  },
  created() {
    this.$store.dispatch("getList");
  },
  methods: {
    // 输入框的值改变 改变vuex state中的值
    inputValueChange(e) {
      this.$store.commit("setInputValue", e.target.value);
    },
    // 点击添加按钮,调用vuex mutations中的方法,将输入框的值添加到list中
    addItemToList() {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning("文本框内容不能为空！");
      }
      this.$store.commit("addItemToList", this.inputValue.trim());
    },
    // 点击删除 调用vuex mutations中的方法
    removeItemById(id) {
      this.$store.commit("removeItemById", id);
    },
    // 复选框的状态改变
    checkboxStatusChanged(e, id) {
      this.$store.commit("changeItemStatusById", {
        id,
        status: e.target.checked,
      });
    },
    // 清除已完成的数据
    clean(){
      this.$store.commit('clean')
    },
    // 切换现实状态
    changeList(flag){
      this.$store.commit('changeCurrentKey',flag)
    }
  },
};
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin: 10px auto;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
