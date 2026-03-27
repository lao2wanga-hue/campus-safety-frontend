<template>
  <div class="processing-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>处理中隐患</span>
        </div>
      </template>
      
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
        <el-table-column prop="handlerName" label="维修员" width="120">
          <template #default="{ row }">
            {{ row.handlerName || '未分配' }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="分配时间" width="180">
          <template #default="{ row }">
            {{ row.updatedAt || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <!-- 维修员：可以完成修理 -->
            <template v-if="userStore.role === 'RECTIFIER' && row.handlerId === userStore.userId">
              <el-button type="success" size="small" @click="completeRepair(row)">完成修理</el-button>
            </template>
            
            <!-- 管理员：可以查看 -->
            <template v-else>
              <el-button type="info" size="small" @click="viewDetail(row)">详情</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyTasks, completeRepairApi } from '@/api/hazard'

const userStore = useUserStore()
const loading = ref(false)
const hazardList = ref([])

const getLevelType = (level) => {
  const map = { LOW: 'info', MEDIUM: 'warning', HIGH: 'danger' }
  return map[level] || 'info'
}

const getLevelText = (level) => {
  const map = { LOW: '低', MEDIUM: '中', HIGH: '高' }
  return map[level] || level
}

// 加载我的任务（维修员名下的隐患）
const loadList = async () => {
  loading.value = true
  try {
    const res = await getMyTasks()
    // 只显示处理中的隐患
    hazardList.value = (res.data || []).filter(h => h.status === 'PROCESSING')
    console.log('我的任务列表:', hazardList.value)
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 完成修理
const completeRepair = async (row) => {
  try {
    await ElMessageBox.confirm('确定完成修理？', '提示', { type: 'warning' })
    await completeRepairApi(row.id)
    ElMessage.success('修理完成，隐患状态已更新为已解决')
    loadList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const viewDetail = (row) => {
  ElMessage.info('详情功能开发中...')
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.processing-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>