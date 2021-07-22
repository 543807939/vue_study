<template>
  <div>
    <h3>订单页面</h3>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column width="100px" label="订单价格" prop="order_price"></el-table-column>
        <el-table-column width="100px" label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="!scope.row.pay_status" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="是否发货" prop="is_send"></el-table-column>
        <el-table-column width="200px" label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column width="140px" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改收货地址"
              placement="top"
              :enterable="false"
            >
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
                @click="showProgressDialog(scope.row.order_number)"
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
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editAddrDialogVisible"
        width="50%"
        @close="editAddrDialogClose"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="citydata"
              :props="addressProps"
              @change="handleChange"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddrDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in progressData"
            :key="index"
            :timestamp="activity.ftime"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      // 查询信息
      queryInfo: {
        query: '', //查询参数
        pagenum: 1 /* 当前页码 */,
        pagesize: 10 /* 每页显示条数 */,
        user_id: '' /* 用户id */,
        pay_status: '' /* 支付状态 */,
        is_send: '' /* 是否发货 */,
        order_fapiao_title: '' /* 发票标题 ['个人','公司'] */,
        order_fapiao_company: '' /* 公司名称 */,
        order_fapiao_content: '' /* 发票内容 */,
        consignee_addr: '' /* 发货地址 */,
      },
      orderList: [] /* 订单列表 */,
      total: 0 /* 总数据条数 */,
      editAddrDialogVisible: false /* 修改地址对话框是否展示 */,
      //   编辑地址对象
      addressForm: {
        address1: [],
        address2: '',
      },
      //   编辑地址验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      citydata,
      //   选择省市区/县级联选择框的props
      addressProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children',
      },
      //   物流进度对话框是否展示
      progressDialogVisible: false,
      //   订单编号 (查询物流信息)
      orderNum: 0,
      //   物流数据
      progressData: [],
    }
  },
  methods: {
    //   获取订单列表的数据
    async getOrderList() {
      let { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单信息失败!')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    handleSizeChange(newpageSize) {
      this.queryInfo.pagesize = newpageSize
      this.getOrderList()
    },
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrderList()
    },
    // 点击修改地址按钮 展示弹窗
    showEditDialog() {
      this.editAddrDialogVisible = true
    },
    // 级联选择器改变
    handleChange() {
      console.log(this.addressForm.address1)
    },
    // 关闭编辑弹窗
    editAddrDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击物流进度按钮 展示弹窗
    showProgressDialog(order_number) {
      this.orderNum = order_number
      this.getProgressMsg()
      //   this.progressDialogVisible = true
    },
    // 查看物流信息
    async getProgressMsg() {
      //   let { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('查找物流信息失败!')
      //   }
      this.progressData = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ]
      console.log(this.progressData)
      this.progressDialogVisible = true
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>
<style lang="less" scoped>
</style>