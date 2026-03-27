<template>
  <div class="hazard-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>隐患列表</span>
          <el-button type="primary" @click="$router.push('/hazard/report')">
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
        <el-table-column prop="area" label="区域" width="100" />
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
        <el-table-column label="操作" width="400" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            
            <!-- 管理员：可以调整等级、分配、取消分配、删除 -->
            <template v-if="userStore.role === 'ADMIN'">
              <el-button 
                size="small" 
                type="warning"
                @click="handleChangeLevel(row)"
              >
                调整等级
              </el-button>
              <el-button 
                v-if="row.status === 'PENDING'" 
                size="small" 
                type="primary"
                @click="showAssignDialogFunc(row)"
              >
                分配
              </el-button>
              <!-- ⭐ 取消分配按钮（已分配的隐患） -->
              <el-button 
                v-if="row.status === 'PROCESSING' && row.handlerId" 
                size="small" 
                type="warning"
                @click="cancelAssign(row)"
              >
                取消分配
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

    <!-- 调整等级对话框 -->
    <el-dialog v-model="changeLevelDialogVisible" title="调整隐患等级" width="400px">
      <el-form :model="changeLevelForm" label-width="80px">
        <el-form-item label="当前等级">
          <el-tag :type="getLevelType(currentHazard?.level)">{{ getLevelText(currentHazard?.level) }}</el-tag>
        </el-form-item>
        <el-form-item label="新等级" required>
          <el-select v-model="changeLevelForm.level" placeholder="请选择新等级" style="width: 100%">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeLevelDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="submitChangeLevel" :loading="changing">确认调整</el-button>
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
    <el-dialog v-model="showDetailDialog" title="隐患详情" width="700px">
      <el-descriptions :column="2" border v-if="currentHazard">
        <el-descriptions-item label="标题">{{ currentHazard.title }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag :type="getLevelType(currentHazard.level)">{{ getLevelText(currentHazard.level) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="区域">{{ currentHazard.area || '-' }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ currentHazard.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentHazard.status)">{{ getStatusText(currentHazard.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="上报人">{{ currentHazard.reporterName }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ currentHazard.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="维修员">{{ currentHazard.handlerName || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentHazard.description }}</el-descriptions-item>
        
        <!-- 图片展示 -->
        <el-descriptions-item label="隐患图片" :span="2">
          <div v-if="imageList.length > 0" class="image-gallery">
            <el-image
              v-for="(img, index) in imageList"
              :key="index"
              :src="img"
              :preview-src-list="imageList"
              fit="cover"
              class="image-item"
            />
          </div>
          <el-empty v-else description="无图片" :image-size="80" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
// ⭐ 确保导入 cancelAssignHazard
import { getHazardList, assignHazard, completeRepairApi, deleteHazardApi, getRectifiers, updateHazardLevel, cancelAssignHazard } from '@/api/hazard'

const userStore = useUserStore()
const loading = ref(false)
const assigning = ref(false)
const changing = ref(false)
const showAssignDialog = ref(false)
const showDetailDialog = ref(false)
const changeLevelDialogVisible = ref(false)
const hazardList = ref([])
const rectifierList = ref([])
const currentHazard = ref(null)

const filterForm = reactive({
  status: '',
  level: ''
})

const assignForm = reactive({
  handlerId: null
})

const changeLevelForm = reactive({
  level: ''
})

// 解析图片列表
const imageList = computed(() => {
  if (!currentHazard.value?.images) return []
  try {
    return typeof currentHazard.value.images === 'string' 
      ? JSON.parse(currentHazard.value.images) 
      : currentHazard.value.images
  } catch {
    return []
  }
})

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

// 加载维修员列表
const loadRectifiers = async () => {
  try {
    const res = await getRectifiers()
    rectifierList.value = res.data || []
    console.log('维修员列表:', rectifierList.value)
  } catch (error) {
    console.error('加载维修员失败:', error)
  }
}

// 显示调整等级对话框
const handleChangeLevel = (row) => {
  currentHazard.value = row
  changeLevelForm.level = row.level
  changeLevelDialogVisible.value = true
}

// 提交调整等级
const submitChangeLevel = async () => {
  if (!changeLevelForm.level) {
    ElMessage.warning('请选择新等级')
    return
  }
  if (changeLevelForm.level === currentHazard.value.level) {
    ElMessage.warning('等级未变化')
    changeLevelDialogVisible.value = false
    return
  }
  changing.value = true
  try {
    await updateHazardLevel(currentHazard.value.id, changeLevelForm.level)
    ElMessage.success('等级调整成功')
    changeLevelDialogVisible.value = false
    loadList()
  } catch (error) {
    ElMessage.error(error.message || '调整失败')
  } finally {
    changing.value = false
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

// ⭐ 取消分配
const cancelAssign = async (row) => {
  try {
    await ElMessageBox.confirm('确定取消分配？隐患将回到待处理状态', '提示', { 
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await cancelAssignHazard(row.id)
    ElMessage.success('取消分配成功')
    loadList()  // ⭐ 确保调用后刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
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

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  cursor: pointer;
}
</style>