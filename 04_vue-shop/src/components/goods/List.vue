<template>
  <div>
    <h3>商品列表页面</h3>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column width="800px" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="130px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="130px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="130px" label="创建时间" prop="upd_time"></el-table-column>
        <el-table-column label="操作" >
            <template>
                
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败!");
      }
      console.log(res);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>
<style lang="less" scoped>
</style>