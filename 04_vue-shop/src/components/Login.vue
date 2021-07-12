<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/images/avatar.jpg" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form class="login-form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary">登陆</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {}
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
