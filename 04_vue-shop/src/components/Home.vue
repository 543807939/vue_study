<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/images/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#57606f"
          text-color="#fff"
          active-text-color="#34e7e4"
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" :key="item.id" v-for="item in menus">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="child.id+''" :key="child.id" v-for="child in item.children">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: [],
      iconsObj: {
        125: 'iconfont icon-icon-user',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shuju',
      },
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const res = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单失败!')
      }
      this.menus = res.data
    },
  },
  async mounted() {
    this.getMenuList()
  },
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2f3542;
  background-size: 100% 100%;
  div {
    height: 32px;
    line-height: 32px;
    color: #fff;
    font-size: 20px;
    img {
      margin-right: 10px;
      vertical-align: middle;
    }
  }
}
.el-aside {
  background-color: #57606f;
}
.el-main {
  background-color: #dfe4ea;
}
.iconfont {
  margin-right: 10px;
}
</style>