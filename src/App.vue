<template>
  <AdminLoginModal v-if="!sessionStore.state.isAuthenticated" />
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
