<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Lock /></el-icon>
        <span>安全隐患管理</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <!-- 仪表盘 - 所有角色可见 -->
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <!-- 隐患列表 - 所有角色可见 -->
        <el-menu-item index="/hazard/list">
          <el-icon><List /></el-icon>
          <span>隐患列表</span>
        </el-menu-item>
        
        <!-- 上报隐患 - 所有角色可见 -->
        <el-menu-item index="/hazard/report">
          <el-icon><CirclePlus /></el-icon>
          <span>上报隐患</span>
        </el-menu-item>
        
        <!-- 处理中隐患 - 管理员和维修员可见 -->
        <el-menu-item 
          v-if="userStore.role === 'ADMIN' || userStore.role === 'RECTIFIER'" 
          index="/hazard/processing"
        >
          <el-icon><Tools /></el-icon>
          <span>处理中隐患</span>
        </el-menu-item>
        
        <!-- 用户管理 - 仅管理员可见 -->
        <el-menu-item 
          v-if="userStore.role === 'ADMIN'" 
          index="/user/manage"
        >
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <span>校园安全隐患管理系统</span>
        </div>
        <div class="header-right">
          <span class="username">{{ userStore.realName }}</span>
          <el-tag :type="getRoleType(userStore.role)" size="small">
            {{ getRoleText(userStore.role) }}
          </el-tag>
          <el-dropdown @command="handleCommand">
            <el-icon :size="20"><UserFilled /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 页面内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'
import { 
  Lock, 
  DataAnalysis, 
  List, 
  CirclePlus, 
  Tools, 
  User, 
  UserFilled 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

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

const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' })
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 60px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid #3d4a5a;
}

.el-menu {
  border-right: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-left {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>