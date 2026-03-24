<template>
  <div class="user-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>
      
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList } from '@/api/user'

const userList = ref([])
const showCreateDialog = ref(false)

const getRoleType = (role) => {
  const map = { ADMIN: 'danger', REPORTER: 'warning', RECTIFIER: 'primary' }
  return map[role] || 'info'
}

const getRoleText = (role) => {
  const map = { ADMIN: '管理员', REPORTER: '上报员', RECTIFIER: '处理员' }
  return map[role] || role
}

const loadList = async () => {
  const res = await getUserList()
  userList.value = res.data
}

const editUser = (row) => {
  console.log('编辑用户', row)
}

const deleteUser = async (row) => {
  await ElMessageBox.confirm('确定删除该用户？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.user-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>