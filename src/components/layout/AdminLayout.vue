<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': uiStore.isSidebarCollapsed }">
    <AdminSidebar />
    <div class="main-wrapper">
      <AdminTopbar />
      <main class="content-area">
        <router-view />
      </main>
      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import { uiStore } from '../../stores/uiStore';
import AdminSidebar from './AdminSidebar.vue';
import AdminTopbar from './AdminTopbar.vue';
import AdminFooter from './AdminFooter.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-surface-sunken);
  color: var(--text-primary);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 260px; /* Sidebar width */
  transition: margin-left 0.3s ease;
}

.admin-layout.sidebar-collapsed .main-wrapper {
  margin-left: 80px;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
}
</style>
