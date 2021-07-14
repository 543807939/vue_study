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
      <el-aside :width="flag ? '63px' : '280px'">
        <div class="tog-button" @click="toggoleCollapse">|||</div>
        <el-menu
          background-color="#57606f"
          text-color="#fff"
          active-text-color="#34e7e4"
          unique-opened
          :collapse="flag"
          :collapse-transition="false"
          router
          :default-active="active"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menus"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + child.path"
              :key="child.id"
              v-for="child in item.children"
              @click="saveNavState('/' + child.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题区域 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 是否折叠
      flag: false,
      // 默认活跃的菜单项
      active: "",
      menus: [],
      iconsObj: {
        125: "iconfont icon-icon-user",
        103: "iconfont icon-quanxian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-dingdan",
        145: "iconfont icon-shuju",
      },
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error("获取菜单失败!");
      }
      this.menus = res.data;
      const sessionActive = window.sessionStorage.getItem("activeItem");
      this.active = sessionActive
        ? sessionActive
        : "/" + this.menus[0].children[0].path;
      // this.$router.push(this.active)
    },
    toggoleCollapse() {
      this.flag = !this.flag;
    },
    // 保存链接激活状态
    saveNavState(index) {
      window.sessionStorage.setItem("activeItem", index);
      this.active = index;
    },
  },
  mounted() {
    this.getMenuList();
  },
};
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
  .tog-button {
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    background-color: #57606f;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #dfe4ea;
}
.iconfont {
  margin-right: 10px;
}
</style>