<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <el-icon :size="40" color="#409EFF"><Lock /></el-icon>
        <h2>校园安全隐患管理系统</h2>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- ⭐ 新增注册链接 -->
      <div class="register-link">
        没有账号？
        <router-link to="/register">立即注册</router-link>
      </div>
      
      <div class="login-tips">
        <p>测试账号：admin / 123456</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Lock } from '@element-plus/icons-vue';

// ... 原有代码保持不变
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin-top: 10px;
  color: #303133;
}

.login-form {
  margin-top: 20px;
}

/* ⭐ 新增注册链接样式 */
.register-link {
  text-align: center;
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.login-tips {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 15px;
}
</style>