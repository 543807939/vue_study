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
          <el-input
            placeholder="请输入内容"
            @clear="search"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          width="105px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          width="80px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column width="170px" label="创建时间" prop="upd_time ">
          <template slot-scope="scope">{{
            scope.row.upd_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <!-- 编辑弹窗区域 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :model="editGood" :rules="editGoodRules" ref="editGoodRef">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGood.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGood.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGood.goods_weight" type="number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditGood">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <router-view></router-view>
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
      // 编辑弹窗是否显示
      editDialogVisible: false,
      // 编辑的商品
      editGood: {},
      // 编辑商品验证规则
      editGoodRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
      },
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
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },
    search() {
      this.getGoodsList();
    },
    // 删除商品
    async deleteGoods(id) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult == "cancel") {
        return;
      }
      // 确认删除 执行删除操作
      let { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败!");
      }
      this.getGoodsList();
      this.$message.success("删除成功!");
    },
    // 点击添加按钮
    goAddPage() {
      this.$router.push("/goods/add");
    },
    // 点击编辑按钮
    async showEditDialog(goods_id) {
      let { data: res } = await this.$http.get(`goods/${goods_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品失败!");
      }
      this.editGood = res.data;
      this.editDialogVisible = true;
    },
    // 关闭弹窗
    editDialogClose() {
      this.$refs.editGoodRef.resetFields();
    },
    // 提交编辑
    submitEditGood() {
      this.$refs.editGoodRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        // 验证通过,执行提交操作
        let { data: res } = await this.$http.put(
          `goods/${this.editGood.goods_id}`,
          this.editGood
        );
        if (res.meta.status !== 201) {
          this.$message.error("修改商品信息失败!");
        }
        this.getGoodsList();
        this.$message.success("修改商品信息成功!");
        this.editDialogVisible = false;
      });
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>
<style lang="less" scoped>
</style>