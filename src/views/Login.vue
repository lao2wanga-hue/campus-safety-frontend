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
      
      <div class="login-tips">
        <p>测试账号：admin / 123456</p>
        <p>测试账号：1123 / 123456</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// ⭐ 必须导入这些
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

// ⭐ 必须初始化 router
const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log('=== 开始登录 ===')
        
        // 调用登录
        await userStore.login(loginForm)
        
        console.log('=== 登录成功 ===')
        console.log('token:', localStorage.getItem('token'))
        console.log('role:', localStorage.getItem('role'))
        
        // 显示成功消息
        ElMessage.success('登录成功')
        
        // 延迟一下确保存储完成
        setTimeout(() => {
          console.log('=== 准备跳转 ===')
          router.push('/dashboard')
        }, 100)
        
      } catch (error) {
        console.error('=== 登录失败 ===')
        console.error('error:', error)
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
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

.login-tips {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 15px;
}

.login-tips p {
  margin: 5px 0;
}
</style>