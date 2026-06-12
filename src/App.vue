<template>
  <div v-if="sessionStore.state.isLoading" class="admin-loading-screen">
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Verifying credentials...</p>
    </div>
  </div>
  <AdminLoginModal v-else-if="!sessionStore.state.isAuthenticated" />
  <AdminLayout v-else />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdminSessionStore } from './stores/adminSessionStore';
import AdminLoginModal from './components/auth/AdminLoginModal.vue';
import AdminLayout from './components/layout/AdminLayout.vue';

const sessionStore = useAdminSessionStore();

onMounted(() => {
  sessionStore.initSession();
});
</script>

<style scoped>
.admin-loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(15, 108, 56, 0.1);
  border-top-color: #0f6c38;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-container p {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
