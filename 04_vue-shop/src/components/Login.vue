<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/images/avatar.jpg" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            ref="usernameRef"
            prefix-icon="iconfont icon-icon-user"
            v-model.lazy="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            v-model.lazy="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" v-on:click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3-10之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入登陆密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 14,
            message: '长度在6-14之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮 重置登录表单
    resetLoginForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(async (flag) => {
        if (!flag) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status === 400) {
          this.$message.error('登陆失败!')
        } else {
          this.$message.success('登陆成功!')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
  },
  mounted() {
    this.$refs.usernameRef.$refs.input.focus()
  },
}
</script>
<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  .avatar-box {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);

    width: 130px;
    height: 130px;
    padding: 10px;
    border-radius: 50%;
    border: 1px solid #eee;
    box-shadow: 0 0 4px #eee;
    overflow: hidden;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
  }
}
</style>
