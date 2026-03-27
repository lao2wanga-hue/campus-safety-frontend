<template>
  <div class="sidebar-container">
    <div class="logo">
      <el-icon><Lock /></el-icon>
      <span>安全管理系统</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <el-menu-item
        v-for="route in menuRoutes"
        :key="route.path"
        :index="route.path"
      >
        <el-icon><component :is="route.meta.icon" /></el-icon>
        <span>{{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  const routes = [
    { path: '/dashboard', meta: { title: '仪表盘', icon: 'DataAnalysis' } },
    { path: '/hazard/list', meta: { title: '隐患列表', icon: 'List' } },
    { path: '/hazard/report', meta: { title: '上报隐患', icon: 'CirclePlus' } }
  ]
  
  if (userStore.isAdmin) {
    routes.push({ 
      path: '/user/manage', 
      meta: { title: '用户管理', icon: 'User' } 
    })
  }
  
  return routes
})
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  gap: 10px;
}

.logo .el-icon {
  font-size: 24px;
}

.el-menu {
  border-right: none;
}
</style>