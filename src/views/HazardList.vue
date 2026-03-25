<template>
  <div class="hazard-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>隐患列表</span>
          <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
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
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">查询</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="hazardList" style="width: 100%" v-loading="loading">
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
        <el-table-column prop="handlerName" label="维修员" width="100">
          <template #default="{ row }">
            {{ row.handlerName || '未分配' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="上报时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            
            <!-- 管理员：可以分配、删除 -->
            <template v-if="userStore.role === 'ADMIN'">
              <el-button 
                v-if="row.status === 'PENDING'" 
                size="small" 
                type="primary"
                @click="showAssignDialogFunc(row)"
              >
                分配
              </el-button>
              <el-button size="small" type="danger" @click="deleteHazard(row.id)">删除</el-button>
            </template>
            
            <!-- 维修员：可以完成修理 -->
            <template v-else-if="userStore.role === 'RECTIFIER'">
              <el-button 
                v-if="row.status === 'PROCESSING' && row.handlerId === userStore.userId" 
                size="small" 
                type="success"
                @click="completeRepair(row)"
              >
                完成修理
              </el-button>
            </template>
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
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCreate" :loading="creating">提交</el-button>
      </template>
    </el-dialog>
    
    <!-- 分配隐患对话框 -->
    <el-dialog v-model="showAssignDialog" title="分配隐患" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="维修员" required>
          <el-select v-model="assignForm.handlerId" placeholder="请选择维修员" style="width: 100%">
            <el-option 
              v-for="rectifier in rectifierList" 
              :key="rectifier.id" 
              :label="rectifier.realName" 
              :value="rectifier.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAssignDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAssign" :loading="assigning">分配</el-button>
      </template>
    </el-dialog>
    
    <!-- 隐患详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="隐患详情" width="600px">
      <el-descriptions :column="2" border v-if="currentHazard">
        <el-descriptions-item label="标题">{{ currentHazard.title }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag :type="getLevelType(currentHazard.level)">{{ getLevelText(currentHazard.level) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="位置">{{ currentHazard.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentHazard.status)">{{ getStatusText(currentHazard.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentHazard.description }}</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ currentHazard.reporterName }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ currentHazard.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="维修员">{{ currentHazard.handlerName || '未分配' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
// ⭐ 确保导入 getRectifiers
import { getHazardList, createHazard, assignHazard, completeRepairApi, deleteHazardApi, getRectifiers } from '@/api/hazard'

const userStore = useUserStore()
const loading = ref(false)
const creating = ref(false)
const assigning = ref(false)
const showCreateDialog = ref(false)
const showAssignDialog = ref(false)
const showDetailDialog = ref(false)
const createFormRef = ref(null)
const hazardList = ref([])
const rectifierList = ref([])
const currentHazard = ref(null)

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

const assignForm = reactive({
  handlerId: null
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }]
}

const getLevelType = (level) => {
  const map = { LOW: 'info', MEDIUM: 'warning', HIGH: 'danger' }
  return map[level] || 'info'
}

const getLevelText = (level) => {
  const map = { LOW: '低', MEDIUM: '中', HIGH: '高' }
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

// 加载隐患列表
const loadList = async () => {
  loading.value = true
  try {
    const res = await getHazardList(filterForm.status, filterForm.level)
    hazardList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// ⭐ 修复：使用正确的 getRectifiers API
const loadRectifiers = async () => {
  try {
    const res = await getRectifiers()  // ⭐ 使用 getRectifiers 而不是 getHazardList
    rectifierList.value = res.data || []
    console.log('维修员列表:', rectifierList.value)  // ⭐ 添加日志方便调试
  } catch (error) {
    console.error('加载维修员失败:', error)
    ElMessage.error('加载维修员列表失败')
  }
}

// 提交创建
const submitCreate = async () => {
  await createFormRef.value.validate()
  creating.value = true
  try {
    await createHazard(createForm)
    ElMessage.success('上报成功')
    showCreateDialog.value = false
    loadList()
    Object.assign(createForm, { title: '', description: '', location: '', level: 'MEDIUM' })
  } catch (error) {
    ElMessage.error(error.message || '上报失败')
  } finally {
    creating.value = false
  }
}

// 显示分配对话框
const showAssignDialogFunc = (row) => {
  currentHazard.value = row
  assignForm.handlerId = null
  showAssignDialog.value = true
}

// 提交分配
const submitAssign = async () => {
  if (!assignForm.handlerId) {
    ElMessage.warning('请选择维修员')
    return
  }
  assigning.value = true
  try {
    await assignHazard(currentHazard.value.id, assignForm.handlerId)
    ElMessage.success('分配成功')
    showAssignDialog.value = false
    loadList()
  } catch (error) {
    ElMessage.error(error.message || '分配失败')
  } finally {
    assigning.value = false
  }
}

// 完成修理
const completeRepair = async (row) => {
  try {
    await ElMessageBox.confirm('确定完成修理？', '提示', { type: 'warning' })
    await completeRepairApi(row.id)
    ElMessage.success('修理完成')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 查看详情
const viewDetail = (row) => {
  currentHazard.value = row
  showDetailDialog.value = true
}

// 删除隐患
const deleteHazard = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该隐患？', '警告', { type: 'danger' })
    await deleteHazardApi(id)
    ElMessage.success('删除成功')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadList()
  // ⭐ 管理员和维修员需要加载维修员列表
  if (userStore.role === 'ADMIN' || userStore.role === 'RECTIFIER') {
    loadRectifiers()
  }
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