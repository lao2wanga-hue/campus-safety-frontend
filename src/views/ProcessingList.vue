<template>
  <div class="processing-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>处理中隐患</span>
        </div>
      </template>
      
      <el-table :data="hazards" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="level" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rectifierName" label="维修员" width="120" />
        <el-table-column prop="assignTime" label="分配时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <!-- 维修员：可以完成修理 -->
            <template v-if="userStore.role === 'RECTIFIER' && row.rectifierId === userStore.userId">
              <el-button type="success" size="small" @click="completeRepair(row.id)">完成修理</el-button>
            </template>
            
            <!-- 管理员：可以查看 -->
            <template v-else-if="userStore.role === 'ADMIN'">
              <el-button type="info" size="small" @click="showDetail(row)">详情</el-button>
            </template>
            
            <!-- 其他用户：只能查看 -->
            <template v-else>
              <el-button type="info" size="small" @click="showDetail(row)">详情</el-button>
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
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const userStore = useUserStore()
const loading = ref(false)
const hazards = ref([])

const loadHazards = async () => {
  loading.value = true
  try {
    const res = await request({
      url: '/hazard/processing',
      method: 'get'
    })
    hazards.value = res.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const completeRepair = async (id) => {
  try {
    await request({
      url: `/hazard/${id}/complete`,
      method: 'post'
    })
    ElMessage.success('修理完成')
    loadHazards()
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

const showDetail = (row) => {
  ElMessage.info('详情功能开发中...')
}

const getLevelType = (level) => {
  const map = { LOW: 'info', MEDIUM: 'warning', HIGH: 'danger' }
  return map[level] || 'info'
}

onMounted(() => {
  loadHazards()
})
</script>

<style scoped>
.processing-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>