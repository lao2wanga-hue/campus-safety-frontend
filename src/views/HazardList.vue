<template>
  <div class="hazard-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>隐患列表</span>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            上报隐患
          </el-button>
        </div>
      </template>
      
      <!-- 筛选 -->
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待处理" value="PENDING" />
            <el-option label="处理中" value="PROCESSING" />
            <el-option label="已解决" value="RESOLVED" />
            <el-option label="已关闭" value="CLOSED" />
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="filterForm.level" placeholder="全部" clearable>
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
            <el-option label="紧急" value="CRITICAL" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">查询</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="hazardList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ getLevelText(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reporterName" label="上报人" width="100" />
        <el-table-column prop="createdAt" label="上报时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            <el-button 
              v-if="userStore.role === 'ADMIN' || userStore.role === 'RECTIFIER'" 
              size="small" 
              type="primary"
              @click="handleProcess(row)"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 创建隐患对话框 -->
    <el-dialog v-model="showCreateDialog" title="上报隐患" width="600px">
      <el-form :model="createForm" :rules="rules" ref="createFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入隐患标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="createForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="请详细描述隐患情况" 
          />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="createForm.location" placeholder="请输入隐患位置" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="createForm.level" placeholder="请选择等级">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
            <el-option label="紧急" value="CRITICAL" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCreate" :loading="creating">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getHazardList, createHazard } from '@/api/hazard'

const userStore = useUserStore()
const showCreateDialog = ref(false)
const creating = ref(false)
const hazardList = ref([])
const filterForm = reactive({
  status: '',
  level: ''
})

const createForm = reactive({
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

const getLevelType = (level) => {
  const map = { LOW: 'info', MEDIUM: 'warning', HIGH: 'danger', CRITICAL: 'danger' }
  return map[level] || 'info'
}

const getLevelText = (level) => {
  const map = { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '紧急' }
  return map[level] || level
}

const getStatusType = (status) => {
  const map = { PENDING: 'warning', PROCESSING: 'primary', RESOLVED: 'success', CLOSED: 'info' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { PENDING: '待处理', PROCESSING: '处理中', RESOLVED: '已解决', CLOSED: '已关闭' }
  return map[status] || status
}

const loadList = async () => {
  const res = await getHazardList(filterForm.status, filterForm.level)
  hazardList.value = res.data
}

const submitCreate = async () => {
  await createFormRef.value.validate()
  creating.value = true
  try {
    await createHazard(createForm)
    ElMessage.success('上报成功')
    showCreateDialog.value = false
    loadList()
    // 重置表单
    Object.assign(createForm, { title: '', description: '', location: '', level: 'MEDIUM' })
  } finally {
    creating.value = false
  }
}

const viewDetail = (row) => {
  // TODO: 跳转到详情页
  console.log('查看详情', row)
}

const handleProcess = (row) => {
  // TODO: 处理隐患
  console.log('处理隐患', row)
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.hazard-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}
</style>