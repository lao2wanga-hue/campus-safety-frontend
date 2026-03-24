<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" color="#409EFF"><Document /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">隐患总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" color="#E6A23C"><Clock /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" color="#409EFF"><Tools /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.processing }}</div>
              <div class="stat-label">处理中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon class="stat-icon" color="#67C23A"><CircleCheck /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.resolved }}</div>
              <div class="stat-label">已解决</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card>
          <template #header>隐患等级分布</template>
          <div ref="levelChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>近 30 天趋势</template>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 待处理列表 -->
    <el-card class="pending-list">
      <template #header>待处理隐患</template>
      <el-table :data="pendingList" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ getLevelText(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="上报时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleProcess(row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Document, Clock, Tools, CircleCheck } from '@element-plus/icons-vue'
import { getStatistics, getHazardList } from '@/api/hazard'
import * as echarts from 'echarts'

const stats = reactive({
  total: 0,
  pending: 0,
  processing: 0,
  resolved: 0
})

const pendingList = ref([])
const levelChart = ref(null)
const trendChart = ref(null)

const getLevelType = (level) => {
  const map = { LOW: 'info', MEDIUM: 'warning', HIGH: 'danger', CRITICAL: 'danger' }
  return map[level] || 'info'
}

const getLevelText = (level) => {
  const map = { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '紧急' }
  return map[level] || level
}

const loadStatistics = async () => {
  const res = await getStatistics()
  Object.assign(stats, res.data)
  pendingList.value = await getHazardList('PENDING').then(r => r.data.slice(0, 5))
  
  // 渲染图表
  renderLevelChart(res.data.byLevel)
  renderTrendChart(res.data.byDate)
}

const renderLevelChart = (data) => {
  if (!levelChart.value) return
  const chart = echarts.init(levelChart.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      name: '隐患等级',
      type: 'pie',
      radius: ['40%', '70%'],
      data: data.map(item => ({
        name: { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '紧急' }[item.level],
        value: item.count
      })),
      label: { show: true, formatter: '{b}: {c} ({d}%)' }
    }]
  })
}

const renderTrendChart = (data) => {
  if (!trendChart.value) return
  const chart = echarts.init(trendChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: { type: 'value' },
    series: [{
      data: data.map(item => item.count),
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  })
}

const handleProcess = (row) => {
  console.log('处理隐患', row)
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 48px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.charts {
  margin-bottom: 20px;
}

.pending-list {
  margin-top: 20px;
}
</style>