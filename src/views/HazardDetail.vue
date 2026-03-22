<template>
  <div class="hazard-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>隐患详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detail.status)">{{ detail.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag :type="getLevelType(detail.level)">{{ detail.level }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail.location }}</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ detail.reporterName }}</el-descriptions-item>
        <el-descriptions-item label="整改人">{{ detail.rectifierName }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>隐患描述</el-divider>
      <p>{{ detail.description || '无描述' }}</p>

      <el-divider>整改日志</el-divider>
      <el-timeline>
        <el-timeline-item
          v-for="log in detail.logs"
          :key="log.id"
          :timestamp="log.createTime"
          placement="top"
        >
          <el-card>
            <h4>{{ log.userName }} - {{ log.actionType }}</h4>
            <p>{{ log.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHazardDetail } from '@/api/hazard'

const route = useRoute()
const router = useRouter()
const detail = ref({ logs: [] })

const loadData = async () => {
  try {
    const res = await getHazardDetail(route.params.id)
    detail.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const getLevelType = (level) => {
  const map = { NORMAL: 'info', HIGH: 'warning', URGENT: 'danger' }
  return map[level] || 'info'
}

const getStatusType = (status) => {
  const map = { 
    PENDING: 'warning', 
    ASSIGNED: 'primary', 
    RECTIFYING: 'success', 
    COMPLETED: 'success', 
    REJECTED: 'info' 
  }
  return map[status] || 'info'
}

const goBack = () => {
  router.back()
}

onMounted(loadData)
</script>

<style scoped>
.hazard-detail {
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>