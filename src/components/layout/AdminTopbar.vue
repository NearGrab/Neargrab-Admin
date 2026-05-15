<template>
  <header class="admin-topbar">
    <div class="topbar-left">
      <button class="menu-toggle" @click="uiStore.toggleSidebar">
        <Menu class="icon" />
      </button>
      <div class="search-bar">
        <Search class="search-icon" />
        <input type="text" placeholder="Search for shops, users, products, orders..." />
        <span class="shortcut">Ctrl + K</span>
      </div>
    </div>
    
    <div class="topbar-right">
      <button class="icon-btn">
        <Bell class="icon" />
        <span class="badge">8</span>
      </button>
      <button class="icon-btn">
        <MessageSquare class="icon" />
        <span class="badge">3</span>
      </button>
      
      <div class="profile-dropdown" v-if="admin" @click="handleLogout">
        <div class="avatar">{{ admin.avatarInitials }}</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { uiStore } from '../../stores/uiStore';
import { useAdminSessionStore } from '../../stores/adminSessionStore';
import { Menu, Search, Bell, MessageSquare } from '@lucide/vue';

const router = useRouter();
const sessionStore = useAdminSessionStore();
const admin = computed(() => sessionStore.state.admin);

const handleLogout = async () => {
  if (confirm('Are you sure you want to log out?')) {
    await sessionStore.logout();
    router.push('/');
  }
};
</script>

<style scoped>
.admin-topbar {
  height: 72px;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
}

.menu-toggle:hover {
  background-color: #f3f4f6;
}

.search-bar {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 18px;
  height: 18px;
}

.search-bar input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9fafb;
}

.search-bar input:focus {
  outline: none;
  border-color: #d1d5db;
  background-color: #fff;
}

.shortcut {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #9ca3af;
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
}

.icon-btn:hover {
  background-color: #f3f4f6;
}

.icon-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.profile-dropdown {
  cursor: pointer;
  margin-left: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  background-color: var(--primary-color, #0B4A26);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

@media (max-width: 768px) {
  .search-bar {
    display: none;
  }
}
</style>
