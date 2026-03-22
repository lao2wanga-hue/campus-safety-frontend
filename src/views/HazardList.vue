<template>
  <div class="hazard-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>隐患列表</span>
          <el-button type="primary" @click="goToReport">
            <el-icon><CirclePlus /></el-icon>
            上报隐患
          </el-button>
        </div>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 'PENDING'"
              size="small"
              type="primary"
              @click="handleAssign(scope.row)"
            >
              分配
            </el-button>
            <el-button
              v-if="scope.row.status === 'ASSIGNED'"
              size="small"
              type="success"
              @click="handleComplete(scope.row)"
            >
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配对话框 -->
    <el-dialog v-model="assignDialog.visible" title="分配整改任务" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="整改人 ID">
          <el-input v-model="assignForm.rectifierId" placeholder="输入整改人 ID" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="assignForm.comment"
            type="textarea"
            placeholder="可选"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHazardList, assignHazard } from '@/api/hazard'
import { HAZARD_STATUS } from '@/utils/constants'
import { ElMessage } from 'element-plus'

const router = useRouter()
const tableData = ref([])
const searchForm = reactive({ status: '' })
const statusOptions = HAZARD_STATUS

const assignDialog = reactive({ visible: false, currentId: null })
const assignForm = reactive({ rectifierId: '', comment: '' })

const loadData = async () => {
  try {
    const res = await getHazardList(searchForm.status ? { status: searchForm.status } : {})
    tableData.value = res.data || []
  } catch (error) {
    console.error(error)
  }
}

const resetSearch = () => {
  searchForm.status = ''
  loadData()
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

const viewDetail = (row) => {
  router.push(`/hazard/detail/${row.id}`)
}

const goToReport = () => {
  router.push('/hazard/report')
}

const handleAssign = (row) => {
  assignDialog.currentId = row.id
  assignDialog.visible = true
  assignForm.rectifierId = ''
  assignForm.comment = ''
}

const submitAssign = async () => {
  if (!assignForm.rectifierId) {
    ElMessage.warning('请输入整改人 ID')
    return
  }
  try {
    await assignHazard({
      hazardId: assignDialog.currentId,
      rectifierId: assignForm.rectifierId,
      comment: assignForm.comment
    })
    ElMessage.success('分配成功')
    assignDialog.visible = false
    loadData()
  } catch (error) {
    console.error(error)
  }
}

const handleComplete = async (row) => {
  try {
    await assignHazard({
      hazardId: row.id,
      rectifierId: row.rectifierId,
      comment: '整改完成'
    })
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(loadData)
</script>

<style scoped>
.hazard-list {
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>