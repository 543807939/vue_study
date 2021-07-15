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
          <el-input clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="handleClose"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="newUser"
        :rules="newUserRules"
        ref="newUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="newUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 对话框内容 -->
      <el-form
        :model="editUser"
        :rules="newUserRules"
        ref="editUserRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义手机号校验规则
    var phoneRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }

      setTimeout(() => {
        if (!/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/.test(value)) {
          return callback(new Error("请输入正确的手机号码"));
        }
        return callback();
      }, 100);
    };
    // 自定义邮箱的校验规则
    var emailRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value)) {
          return callback(new Error("请输入正确的邮箱"));
        }
        return callback();
      }, 100);
    };
    return {
      // 获取用户列表的查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      newUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      newUserRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 6,
            max: 14,
            message: "长度在 6 到 14 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailRule, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: phoneRule, trigger: "blur" },
        ],
      },
      // 修改用户对话框显示状态
      editDialogVisible: false,
      // 需要修改的用户信息
      editUser: {},
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
      this.total = res.data.total;
    },
    // 监听pageSize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch状态的改变
    async userStateChange(user) {
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("修改失败!");
      }
      this.$message.success("修改成功!");
    },
    addUser() {
      this.$refs.newUserRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        const { data: res } = await this.$http.post("users", this.newUser);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功!!");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 添加对话框关闭事件
    handleClose() {
      this.addDialogVisible = false;
      this.$refs.newUserRef.resetFields();
    },
    // 展示编辑对话框
    async showEditDialog(id) {
      let { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败!");
      }
      this.editUser = res.data;
      console.log(res.data);
      this.editDialogVisible = true;
    },
    // 编辑对话框关闭事件
    editDialogClose() {
      this.$refs.editUserRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editUserRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        let { data: res } = await this.$http.put(`users/${this.editUser.id}`, {
          email: this.editUser.email,
          mobile: this.editUser.mobile,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        this.getUserList();
        this.$message.success("更新用户信息成功!");
        this.editDialogVisible = false;
      });
    },
    // 删除用户
    async deleteUser(id) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 确认删除 文本为字符串 confirm
      // 取消删除 则返回值为字符串 cancle
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除!");
      }
      // 删除操作
      let { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败!");
      }
      this.getUserList();
      this.$message.success("删除成功!");
    },
  },
};
</script>
<style lang="less" scoped>
</style>