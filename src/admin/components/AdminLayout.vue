<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">

      <nav>
        <router-link to="/admin/categories">Категории</router-link>
        <router-link to="/admin/products">Товары</router-link>
      </nav>

      <button class="logout" @click="logout">Выйти</button>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 220px;
  background: #111;
  color: #fff;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  color: #fff;
  text-decoration: none;
  opacity: 0.8;
}

.sidebar a.router-link-active {
  opacity: 1;
  font-weight: bold;
}

.logout {
  margin-top: auto;
  background: #e53935;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 24px;
}
</style>
