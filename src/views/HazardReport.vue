<template>
  <div class="hazard-report">
    <el-card>
      <template #header>
        <span>上报隐患</span>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入隐患标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="4"
            placeholder="请详细描述隐患情况" 
          />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入隐患位置" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择等级">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
            <el-option label="紧急" value="CRITICAL" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createHazard } from '@/api/hazard'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  title: '',
  description: '',
  location: '',
  level: 'MEDIUM'
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }]
}

const submit = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await createHazard(form)
    ElMessage.success('上报成功')
    router.push('/hazard/list')
  } finally {
    loading.value = false
  }
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.hazard-report {
  max-width: 800px;
  margin: 0 auto;
}
</style>