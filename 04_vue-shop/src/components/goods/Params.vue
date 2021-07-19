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
      <el-alert title="警告提示的文案" type="warning" :closable="false" show-icon></el-alert>
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
        checkStrictly: true,
        emitPath: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的分类
      selectCate: '',
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
      console.log(this.cateList)
    },
    selectCateChange() {
      console.log(this.selectCate)
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
</style>