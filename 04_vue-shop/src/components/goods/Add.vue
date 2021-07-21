<template>
  <div>
    <h3>添加商品页面</h3>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      ></el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                placeholder="请选择商品分类"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateListProps"
                @change="cateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :key="item.attr_id"
              v-for="item in manyTableData"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :key="index"
                  v-for="(label, index) in item.attr_vals"
                  :label="label"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :key="item.attr_id"
              v-for="item in onlyTableData"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览弹窗 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <el-image
          :src="previewPath"
          fit="contain"
          class="previewImg"
        ></el-image>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 当前活跃的索引
      activeIndex: "0",
      // 添加商品的表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数组
        goods_cat: [],
        // 图片列表
        pics: [],
        // 商品详情
        goods_introduce: "",
        // 参数
        attrs: [],
      },
      // 添加商品的验证规则
      addFormRules: {
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
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类列表
      cateList: [],
      // 商品级联选择器props
      cateListProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 获取的动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览时图片的地址
      previewPath: "",
      // 预览窗口是否显示
      previewVisible: false,
    };
  },
  methods: {
    cateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.error("请选择三级分类");
      }
    },
    // 获取商品分类
    async getCateList() {
      let { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败!");
      }
      console.log(res.data);
      this.cateList = res.data;
    },
    // 获取动态参数列表数据
    async getParams() {
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: "many" } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取动态参数列表失败!");
      }
      res.data.forEach((item) => {
        if (item.attr_vals.length > 0) {
          item.attr_vals = item.attr_vals.split(" ");
        } else {
          item.attr_vals = [];
        }
      });
      this.manyTableData = res.data;
      console.log(this.manyTableData);
    },
    // 获取静态属性数据
    async getAttr() {
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取静态属性列表失败!");
      }
      this.onlyTableData = res.data;
      console.log(this.onlyTableData);
    },
    // 切换标签页
    beforeTabLeave(newItem, oldItem) {
      if (oldItem == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类!");
        return false;
      }
    },
    // 点击标签页
    tabClicked() {
      if (this.activeIndex == 1) {
        this.getParams();
      } else if (this.activeIndex == 2) {
        this.getAttr();
      }
    },
    // 处理函数预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      let filePath = file.response.data.tmp_path;
      let index = this.addForm.pics.findIndex(
        (element) => (element.pic = filePath)
      );
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm);
    },
    // 图片上传成功
    handleSuccess(res) {
      if (res.meta.status !== 200) {
        return this.$message.error("上传失败!");
      }
      let pic = {
        pic: res.data.tmp_path,
      };
      this.addForm.pics.push(pic);
      console.log(this.addForm.pics);
    },
    add() {
      this.$refs.addFormRef.validate(async (flag) => {
        if (!flag) {
          return this.$message.error("请填写必要的表单项目!");
        }
        // 执行添加的操作
        // lodash cloneDeep(obj)
        let form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数和静态属性
        this.manyTableData.forEach((item) => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          form.attrs.push(obj);
        });
        this.onlyTableData.forEach((item) => {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          form.attrs.push(obj);
        });
        // 处理完毕 添加商品
        let { data: res } = await this.$http.post("goods", form);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败!");
        }
        this.$message.success("添加商品成功!");
        this.$router.push('/goods')
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  created() {
    this.getCateList();
  },
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>