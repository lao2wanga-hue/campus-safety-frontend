<template>
  <div class="hazard-detail">
    <el-card>
      <template #header>
        <span>隐患详情</span>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ hazard.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(hazard.status)">{{ getStatusText(hazard.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标题">{{ hazard.title }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag :type="getLevelType(hazard.level)">{{ getLevelText(hazard.level) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="位置">{{ hazard.location }}</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ hazard.reporterName }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ hazard.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ hazard.handlerName || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ hazard.description }}</el-descriptions-item>
        <el-descriptions-item label="解决方案" :span="2">{{ hazard.resolution || '暂无' }}</el-descriptions-item>
      </el-descriptions>
      
      <div class="actions" style="margin-top: 20px;">
        <el-button @click="$router.back()">返回</el-button>
        <el-button 
          v-if="userStore.role === 'ADMIN' || userStore.role === 'RECTIFIER'" 
          type="primary"
          @click="showProcessDialog = true"
        >
          处理
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { getHazardById } from '@/api/hazard'

const route = useRoute()
const userStore = useUserStore()
const hazard = ref({})
const showProcessDialog = ref(false)

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

const loadDetail = async () => {
  const res = await getHazardById(route.params.id)
  hazard.value = res.data
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.hazard-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.actions {
  text-align: right;
}
</style>