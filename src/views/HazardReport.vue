<template>
  <div class="hazard-report">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>上报隐患</span>
        </div>
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
        
        <!-- ⭐ 区域选择（新增） -->
        <el-form-item label="区域" prop="area">
          <el-select v-model="form.area" placeholder="请选择区域" style="width: 100%">
            <el-option label="教学楼" value="教学楼" />
            <el-option label="宿舍楼" value="宿舍楼" />
            <el-option label="食堂" value="食堂" />
            <el-option label="图书馆" value="图书馆" />
            <el-option label="实验楼" value="实验楼" />
            <el-option label="体育馆" value="体育馆" />
            <el-option label="行政楼" value="行政楼" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="具体位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入具体位置（如：3 楼 301 室）" />
        </el-form-item>
        
        <el-form-item label="等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择等级">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
          </el-select>
        </el-form-item>
        
        <!-- ⭐ 图片上传（新增） -->
        <el-form-item label="隐患图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :limit="5"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="预览图片" />
          </el-dialog>
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
import { Plus } from '@element-plus/icons-vue'
import { createHazard, uploadImage } from '@/api/hazard'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const fileList = ref([])

const form = reactive({
  title: '',
  description: '',
  area: '',
  location: '',
  level: 'MEDIUM'
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  area: [{ required: true, message: '请选择区域', trigger: 'change' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }]
}

// 处理文件变化
const handleFileChange = (file, files) => {
  fileList.value = files
}

// 处理文件移除
const handleRemove = (file, files) => {
  fileList.value = files
}

// 上传图片
const uploadFiles = async () => {
  const imageUrls = []
  for (const file of fileList.value) {
    try {
      const res = await uploadImage(file.raw)
      imageUrls.push(res.data.url)
    } catch (error) {
      console.error('图片上传失败:', error)
    }
  }
  return imageUrls
}

// 提交上报
const submit = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    // 先上传图片
    let imageUrls = []
    if (fileList.value.length > 0) {
      imageUrls = await uploadFiles()
    }
    
    // 提交隐患数据
    await createHazard({
      ...form,
      images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null
    })
    
    ElMessage.success('上报成功')
    router.push('/hazard/list')
  } catch (error) {
    ElMessage.error(error.message || '上报失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const reset = () => {
  formRef.value.resetFields()
  fileList.value = []
}
</script>

<style scoped>
.hazard-report {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>