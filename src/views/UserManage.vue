<template>
  <div class="user-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <!-- ⭐ 去掉添加用户按钮 -->
        </div>
      </template>
      
      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary"
              @click="showEditDialog(row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger"
              @click="deleteUser(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ⭐ 编辑用户对话框 -->
    <el-dialog v-model="showEditDialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="editForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="上报员" value="REPORTER" />
            <el-option label="维修员" value="RECTIFIER" />
            <el-option label="管理员" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="editForm.createTime" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="editing">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, updateUser, deleteUserApi } from '@/api/user'

const loading = ref(false)
const editing = ref(false)
const showEditDialogVisible = ref(false)
const editFormRef = ref(null)
const userList = ref([])

const editForm = reactive({
  id: null,
  username: '',
  realName: '',
  role: '',
  createTime: ''
})

const editRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const getRoleType = (role) => {
  const map = { 
    ADMIN: 'danger', 
    RECTIFIER: 'warning', 
    REPORTER: 'info' 
  }
  return map[role] || 'info'
}

const getRoleText = (role) => {
  const map = { 
    ADMIN: '管理员', 
    RECTIFIER: '维修员', 
    REPORTER: '上报员' 
  }
  return map[role] || role
}

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList()
    userList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 显示编辑对话框
const showEditDialog = (row) => {
  editForm.id = row.id
  editForm.username = row.username
  editForm.realName = row.realName
  editForm.role = row.role
  editForm.createTime = row.createTime || row.createdAt || ''
  showEditDialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  await editFormRef.value.validate()
  editing.value = true
  try {
    await updateUser(editForm.id, {
      username: editForm.username,
      realName: editForm.realName,
      role: editForm.role
    })
    ElMessage.success('修改成功')
    showEditDialogVisible.value = false
    loadUserList()
  } catch (error) {
    ElMessage.error(error.message || '修改失败')
  } finally {
    editing.value = false
  }
}

// 删除用户
const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该用户？', '警告', { 
      type: 'danger',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    await deleteUserApi(id)
    ElMessage.success('删除成功')
    loadUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadUserList()
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