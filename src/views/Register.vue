<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <el-icon :size="40" color="#409EFF"><Shield /></el-icon>
        <h2>校园安全隐患管理系统</h2>
        <p class="subtitle">用户注册</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名（3-20 位）"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（6-20 位）"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="registerForm.realName"
            placeholder="请输入真实姓名"
            prefix-icon="UserFilled"
          />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="registerForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="上报人" value="REPORTER" />
            <el-option label="整改人" value="RECTIFIER" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="login-link">
            已有账号？
            <router-link to="/login">立即登录</router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user'
import { ElMessage } from 'element-plus'
import { UserFilled, Shield } from '@element-plus/icons-vue'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  role: 'REPORTER'
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const { confirmPassword, ...registerData } = registerForm
        await register(registerData)
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 450px;
  padding: 20px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  margin-top: 10px;
  color: #303133;
  font-size: 20px;
}

.subtitle {
  color: #909399;
  margin-top: 5px;
  font-size: 14px;
}

.register-form {
  margin-top: 20px;
}

.login-link {
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.login-link a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>