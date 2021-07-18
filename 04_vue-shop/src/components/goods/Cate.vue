<template>
  <div>
    <h3>商品分类页面</h3>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类行 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddClassDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <tree-table
        :data="goodsCategories"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        index-text="#"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted"
            class="el-icon-succes"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level == 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEidtDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addClassDiolagVisible"
        width="50%"
        @close="addClassClose"
      >
        <el-form
          :model="newClass"
          ref="newClassRef"
          :rules="newClassRules"
          label-width="100px"
        >
          <el-form-item prop="cat_name" label="分类名称：">
            <el-input v-model="newClass.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              :options="parentCateList"
              :props="cateProps"
              v-model="selectedKeys"
              @change="parentCateChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassDiolagVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClass">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类弹窗 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
        @close="optClose"
      >
        <el-form
          :model="editClass"
          ref="editClassRef"
          :rules="newClassRules"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editClass.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类数据
      goodsCategories: [],
      //   查询数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   总条数
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 添加框是否展示
      addClassDiolagVisible: false,

      newClassRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      // 添加分类时的分类菜单
      parentCateList: [],
      // 级联选择器配置对象
      cateProps: {
        // 触发方式
        expandTrigger: "hover",
        // 标签
        label: "cat_name",
        // 值
        value: "cat_id",
        // 父子节点通过什么嵌套
        children: "children",
        checkStrictly: true,
      },
      // 添加分类时的新分类对象
      newClass: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 选中的父级分类数组
      selectedKeys: [],
      // 编辑分类弹窗是否展示
      editCateDialogVisible: false,
      // 操作时传递的id
      optId: "",
      // 修改分类的表单
      editClass: {},
    };
  },
  methods: {
    async getGoodsCategories() {
      let { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败!");
      }
      this.goodsCategories = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsCategories();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsCategories();
    },
    // 点击添加分类 展示添加框
    async showAddClassDialog() {
      this.addClassDiolagVisible = true;
      // 获取分类数据
      let { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类数据失败!");
      }
      this.parentCateList = res.data;
    },
    // 级联选择器值改变
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.newClass.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.newClassRules.cat_level = this.selectedKeys.length;
      } else {
        this.newClass.cat_pid = 0;
        this.newClassRules.cat_level = 0;
      }
    },
    // 关闭弹窗处理函数
    addClassClose() {
      this.$refs.newClassRef.resetFields();
      this.selectedKeys = [];
      this.newClass = {
        cat_name: "",
        cat_id: 0,
        cat_level: 0,
      };
    },
    // 提交表单
    addClass() {
      this.$refs.newClassRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        let { data: res } = await this.$http.post("categories", this.newClass);
        if (res.meta.status !== 200) {
          this.$message.error("添加新分类失败!");
        }
        console.log(res);
        this.getGoodsCategories();
        this.$message.success("添加分类成功");
        this.addClassDiolagVisible = false;
      });
    },
    // 打开编辑分类弹窗
    async showEidtDialog(id) {
      this.optId = id;
      // 根据id获取分类数据
      let { data: res } = await this.$http.get(`categories/${this.optId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败!");
      }
      this.editClass = res.data;
      this.editCateDialogVisible = true;
    },
    // 提交编辑
    editCate() {
      // 先对表单进行验证
      this.$refs.editClassRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        // 验证通过,执行提交操作
        let { data: res } = await this.$http.put(`categories/${this.optId}`, {
          cat_name: this.editClass.cat_name,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类失败!");
        }
        this.getGoodsCategories();
        this.$message.success("更新分类成功!");
        this.editCateDialogVisible = false;
      });
    },
    // 删除分类
    async deleteCate(id) {
      this.optId = id;
      let confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if(confirmResult == 'cancel'){
        return
      }
      // 确认删除 执行删除操作
      let {data:res} = await this.$http.delete('categories/'+this.optId)
      if(res.meta.status!==200){
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功!')
      this.getGoodsCategories();
    },
    // 操作关闭时重置操作id
    optClose() {
      this.optId = "";
    },
  },
  created() {
    this.getGoodsCategories();
  },
};
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>