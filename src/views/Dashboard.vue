<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <StatCard
          title="隐患总数"
          :value="stats.total || 0"
          icon="Document"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="待处理"
          :value="stats.pending || 0"
          icon="Clock"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="整改中"
          :value="stats.rectifying || 0"
          icon="Tools"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="6">
        <StatCard
          title="已完成"
          :value="stats.completed || 0"
          icon="CircleCheck"
          color="#909399"
        />
      </el-col>
    </el-row>

    <el-card class="recent-hazards" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>最近隐患</span>
          <el-button type="primary" size="small" @click="goToList">
            查看全部
          </el-button>
        </div>
      </template>
      <el-table :data="recentList" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="level" label="等级" width="80">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上报时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStatistics, getHazardList } from '@/api/hazard'
import StatCard from '@/components/StatCard.vue'

const router = useRouter()
const stats = ref({})
const recentList = ref([])

const loadData = async () => {
  try {
    const statsRes = await getStatistics()
    stats.value = statsRes.data
    
    const listRes = await getHazardList({})
    recentList.value = (listRes.data || []).slice(0, 5)
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

const goToList = () => {
  router.push('/hazard/list')
}

onMounted(loadData)
</script>

<style scoped>
.dashboard {
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>