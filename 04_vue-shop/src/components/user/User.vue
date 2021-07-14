<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input>
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="3">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取用户列表的查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败!");
      }
      this.userList = res.data.users;
      console.log(this.userList);
      this.total = res.data.total;
    },
  },
};
</script>
<style lang="less" scoped>
</style>