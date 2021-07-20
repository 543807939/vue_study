<template>
  <div>
    <h3>分类参数页面</h3>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只可以为第三级菜单设置参数!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectCate"
            clearable
            :options="cateList"
            :props="catSelectProps"
            @change="selectCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 商品属性区域 -->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                size="small"
                type="primary"
                :disabled="addBtnDisabled"
                @click="showAddAttrDialog"
              >添加参数</el-button>
            </el-col>
          </el-row>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="newValue"
                  ref="newValueRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index" label="#">
              <template slot-scope></template>
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                size="small"
                type="primary"
                :disabled="addBtnDisabled"
                @click="showAddAttrDialog"
              >添加属性</el-button>
            </el-col>
          </el-row>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.newValue"
                  ref="newValueRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index" label="#">
              <template slot-scope></template>
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog
        :title="addDialogTitle"
        :visible.sync="addAttrDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <!-- 添加参数表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="addDialogLabel" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAttrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="editDialogTitle"
        :visible.sync="editAttrDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!-- 修改参数表单 -->
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="addDialogLabel" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAttrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      // 级联选择器props对象
      catSelectProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的分类
      selectCate: [],
      // 当前活跃的tab
      activeTab: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 添加对话框的显示隐藏
      addAttrDialogVisible: false,
      // 添加参数的对象
      addForm: { attr_name: '' },
      // 添加参数的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: `请输入参数名称`,
            trigger: 'blur',
          },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      // 编辑的对话框是否展示
      editAttrDialogVisible: false,
      // 编辑的对象
      editForm: {},
      // 新添加属性的值
      newValue: '',
      // 输入框是否显示
      inputVisible: false,
    }
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get('categories', {
        params: {
          type: 3,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败!')
      }
      this.cateList = res.data
    },
    selectCateChange() {
      if (this.selectCate.length !== 3) {
        return (this.selectCate = [])
      }
      this.getAttr()
    },
    // 点击页签触发
    handleTabClick() {
      if (this.addBtnDisabled) {
        return
      }
      this.getAttr()
    },
    // 获取参数
    async getAttr() {
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeTab,
          },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败!')
      }
      res.data.forEach((element) => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(' ')
          : []
        // 控制输入框的显示与隐藏
        element.inputVisible = false
        element.newValue = ''
      })
      console.log(res.data)
      if (this.activeTab == 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭添加参数框时reset表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加参数
    showAddAttrDialog() {
      this.addAttrDialogVisible = true
    },
    // 添加参数操作
    addAttr() {
      this.$refs.addFormRef.validate(async (flag) => {
        if (!flag) {
          return
        }
        // 验证通过
        let { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTab,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败!')
        }
        this.$message.success('添加参数成功!')
        console.log(res)
        this.getAttr()
        this.addAttrDialogVisible = false
      })
    },
    // 关闭编辑窗口
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑
    async showEditDialog(goods) {
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${goods.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败!')
      }
      // 获取信息成功
      this.editForm = res.data
      this.editAttrDialogVisible = true
    },
    // 提交编辑操作
    editAttr() {
      this.$refs.editFormRef.validate(async (flag) => {
        if (!flag) {
          return
        }
        // 验证通过,执行提交操作
        let { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeTab,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改属性失败!')
        }
        this.getAttr()
        this.$message.success('修改属性成功!')
        this.editAttrDialogVisible = false
      })
    },
    // 点击删除
    async deleteAttr(id) {
      let confirmResult = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult === 'cancel') {
        return
      }
      // 确认删除
      let { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.getAttr()
      this.$message.success('删除成功!')
    },
    // 点击+NewTag 显示输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // this.$nextTick 页面重新渲染之后调用这个函数
      this.$nextTick(() => {
        this.$refs.newValueRef.$refs.input.focus()
      })
    },
    // 输入框失去焦点或按下回车
    handleInputConfirm(row) {
      row.inputVisible = false
    },
  },
  computed: {
    addBtnDisabled() {
      return !(this.selectCate.length == 3)
    },
    cateId() {
      if (this.selectCate.length == 3) {
        return this.selectCate[this.selectCate.length - 1]
      }
      return null
    },
    // 标题文本
    addDialogTitle() {
      return this.activeTab == 'many' ? '添加参数' : '添加属性'
    },
    // label
    addDialogLabel() {
      return this.activeTab == 'many' ? '参数名称' : '属性名称'
    },
    // 编辑的标题
    editDialogTitle() {
      return this.activeTab == 'many' ? '编辑参数' : '编辑属性'
    },
  },
  created() {
    this.getCateList()
  },
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.button-new-tag {
  margin: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin: 10px;
  vertical-align: bottom;
}
</style>