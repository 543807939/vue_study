<template>
  <el-container>
    <!-- 头部 -->
    <el-header>Header</el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧主题区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #5758bb;
}
.el-aside {
  background-color: #12cbc4;
}
.el-main {
  background-color: #dfe4ea;
}
</style>