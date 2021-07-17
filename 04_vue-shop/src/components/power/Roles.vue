<template>
  <div>
    <h3>角色列表</h3>
    <h3>权限列表组件页面</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 == 0 ? 'bdtop' : '']"
              :key="item1.id"
              v-for="(item1, i1) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级全选 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  :key="item2.id"
                  v-for="(item2, i2) in item1.children"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      :key="item3.id"
                      v-for="item3 in item2.children"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300px ">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-search"
              size="small"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限区域 -->
      <el-dialog
        title="分配权限"
        :visible.sync="rightDialogVisible"
        width="50%"
        @close="resetDefKeys"
      >
        <!-- 树型控件 -->
        <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色区域 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        @close="resetNewRole"
      >
        <!-- 角色表单 -->
        <el-form
          :model="newRole"
          :rules="newRoleRules"
          ref="newRoleRef"
          label-width="80px"
        >
          <el-form-item prop="roleName" label="角色名称">
            <el-input v-model="newRole.roleName"></el-input>
          </el-form-item>
          <el-form-item prop="roleDesc" label="角色描述">
            <el-input v-model="newRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色区域 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="EidtRoleDialogVisible"
        width="50%"
        @close="resetEditRole"
      >
        <el-form
          :model="eidtRole"
          ref="eidtRoleRef"
          :rules="newRoleRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="eidtRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="eidtRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EidtRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      //   分配权限弹出框是否展示
      rightDialogVisible: false,
      //   权限列表
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      //   默认选择节点的数组
      defKeys: [],
      // 即将分配角色的角色id
      roleId: "",
      // 添加角色弹窗是否展示
      addRoleDialogVisible: false,
      // 新角色对象
      newRole: {
        roleName: "",
        roleDesc: "",
      },
      // 新角色验证规则
      newRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑角色弹窗上是否展示
      EidtRoleDialogVisible: false,
      // 编辑角色对象
      eidtRole: {},
    };
  },
  methods: {
    async getRoleList() {
      let { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      this.roleList = res.data;
    },
    async removeRightById(role, rightId) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmResult == "cancel") {
        return this.$message("取消删除!");
      }
      //   执行删除操作
      let { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色权限失败!");
      }
      this.$message.success("删除角色权限成功!");
      role.children = res.data;
    },
    async showSetRightDialog(role) {
      this.roleId = role.id;
      let { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败!");
      }
      this.rightsList = res.data;
      this.getLeftKeys(role, this.defKeys);
      this.rightDialogVisible = true;
    },
    // 通过递归获取角色下所有三级权限id 并保存到数组中
    getLeftKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => {
        this.getLeftKeys(element, arr);
      });
    },
    resetDefKeys() {
      this.defKeys = [];
      this.roleId = "";
    },
    async allotRights() {
      let checkedIds = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: checkedIds.join(","),
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色权限失败!");
      }
      this.getRoleList();
      this.$message.success("更新角色权限成功!");
      this.rightDialogVisible = false;
    },
    showAddRoleDialog() {
      this.addRoleDialogVisible = true;
    },
    // 添加角色
    addRole() {
      this.$refs.newRoleRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        // 验证通过 执行添加操作
        let { data: res } = await this.$http.post("roles", this.newRole);
        if (res.meta.status !== 200) {
          return this.$message.error("添加新角色失败!");
        }
        this.$message.success("添加新角色成功!");
        this.addRoleDialogVisible = false;
      });
    },
    // 关闭添加角色框时重置表单
    resetNewRole() {
      this.$refs.newRoleRef.resetFields();
    },
    // 点击编辑展示编辑对话框
    async showEditRole(role) {
      // 根据id查询角色
      let { data: res } = await this.$http.get(`roles/${role.id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败!");
      }
      this.eidtRole = res.data;
      this.roleId = res.data.roleId;
      this.EidtRoleDialogVisible = true;
    },
    // 提交编辑的角色
    submitEditRole() {
      this.$refs.eidtRoleRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        // 验证通过,执行提交
        let { data: res } = await this.$http.put(
          `roles/${this.roleId}`,
          this.eidtRole
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色信息失败!");
        }
        this.$message.success("修改角色信息成功!");
        this.EidtRoleDialogVisible = false;
      });
    },
    // 关闭时重置编辑角色
    resetEditRole() {
      this.$refs.eidtRoleRef.resetFields();
    },
    // 点击删除按钮
   async deleteRole(role) {
    let clickResult = await this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err => err)
      if(clickResult == 'cancel'){
        return
      }
      // 点击确认 执行删除操作
      let {data:res} = await this.$http.delete(`roles/${role.id}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除角色失败!')
      }
      this.$message.success('删除角色成功')
      this.getRoleList();
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>