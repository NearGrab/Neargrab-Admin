<template>
  <aside class="admin-sidebar" :class="{ 'collapsed': uiStore.isSidebarCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <MapPin class="logo-icon" />
        <div class="logo-text" v-if="!uiStore.isSidebarCollapsed">
          <span class="brand">Neargrab</span>
          <span class="panel">Admin Panel</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <Home class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Dashboard</span>
      </router-link>

      <router-link to="/users" class="nav-item">
        <Users class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Users</span>
      </router-link>

      <a href="#" class="nav-item inactive" @click.prevent>
        <Store class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Shops</span>
        <ChevronRight class="nav-arrow" v-if="!uiStore.isSidebarCollapsed" />
      </a>

      <router-link to="/products" class="nav-item">
        <Package class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Products</span>
      </router-link>

      <a href="#" class="nav-item inactive" @click.prevent>
        <Star class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Reviews</span>
      </a>

      <a href="#" class="nav-item inactive" @click.prevent>
        <Receipt class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Orders / Leads</span>
      </a>

      <div class="nav-section" :class="{ 'open': isPromoOpen }">
        <div class="nav-item has-children" @click="isPromoOpen = !isPromoOpen">
          <Megaphone class="nav-icon" />
          <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Ad & Promotions</span>
          <ChevronRight class="nav-arrow" :class="{ 'rotated': isPromoOpen }" v-if="!uiStore.isSidebarCollapsed" />
        </div>
        <div class="nav-children" v-show="isPromoOpen && !uiStore.isSidebarCollapsed">
          <router-link to="/banners" class="nav-child">Banner Management</router-link>
          <a href="#" class="nav-child inactive" @click.prevent>Promotions</a>
          <a href="#" class="nav-child inactive" @click.prevent>Boosted Listings</a>
        </div>
      </div>

      <a href="#" class="nav-item inactive" @click.prevent>
        <BarChart2 class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Reports</span>
      </a>
      
      <a href="#" class="nav-item inactive" @click.prevent>
        <Banknote class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Payouts</span>
      </a>

      <a href="#" class="nav-item inactive" @click.prevent>
        <AlertCircle class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Disputes</span>
      </a>

      <a href="#" class="nav-item inactive" @click.prevent>
        <MessageSquare class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Support Tickets</span>
      </a>

      <a href="#" class="nav-item inactive" @click.prevent>
        <Settings class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">System Settings</span>
        <ChevronRight class="nav-arrow" v-if="!uiStore.isSidebarCollapsed" />
      </a>

      <a href="#" class="nav-item inactive" @click.prevent>
        <ClipboardList class="nav-icon" />
        <span class="nav-label" v-if="!uiStore.isSidebarCollapsed">Audit Logs</span>
      </a>
    </nav>

    <div class="sidebar-footer" v-if="admin">
      <div class="admin-profile" v-if="!uiStore.isSidebarCollapsed">
        <div class="avatar">{{ admin.avatarInitials }}</div>
        <div class="admin-info">
          <div class="admin-name">{{ admin.name }}</div>
          <div class="admin-role">{{ formatRole(admin.role) }}</div>
        </div>
        <ChevronDown class="admin-dropdown-icon" />
      </div>
      <div class="avatar centered" v-else>{{ admin.avatarInitials }}</div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div 
    class="sidebar-overlay" 
    v-if="!uiStore.isSidebarCollapsed" 
    @click="uiStore.toggleSidebar"
  ></div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { uiStore } from '../../stores/uiStore';
import { useAdminSessionStore } from '../../stores/adminSessionStore';
import { 
  Home, Users, Store, Package, Star, Receipt, 
  Megaphone, BarChart2, Banknote, AlertCircle, 
  MessageSquare, Settings, ClipboardList, MapPin,
  ChevronRight, ChevronDown
} from '@lucide/vue';

const sessionStore = useAdminSessionStore();
const admin = computed(() => sessionStore.state.admin);

const isPromoOpen = ref(true);

const formatRole = (role) => {
  if (!role) return '';
  return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background-color: var(--primary-color, #0B4A26);
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #FACC15; /* Yellow map pin */
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.panel {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s;
  cursor: pointer;
}

.admin-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
}

.nav-item:hover, .nav-item.router-link-active, .nav-section.open > .nav-item {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.router-link-active {
  background-color: var(--primary-color-light, #126b3a);
  border-left: 4px solid #fff;
  padding-left: 20px;
}

.admin-sidebar.collapsed .nav-item.router-link-active {
  padding-left: 0;
  border-left: none;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label {
  margin-left: 16px;
  flex: 1;
}

.nav-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.nav-arrow.rotated {
  transform: rotate(90deg);
}

.inactive {
  opacity: 0.6;
}

.inactive:hover {
  opacity: 0.8;
}

.nav-children {
  background-color: rgba(0, 0, 0, 0.15);
  padding: 8px 0;
}

.nav-child {
  display: block;
  padding: 10px 24px 10px 60px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-child:hover, .nav-child.router-link-active {
  color: #fff;
}

.nav-child.router-link-active {
  font-weight: 500;
  position: relative;
}

.nav-child.router-link-active::before {
  content: '';
  position: absolute;
  left: 44px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}

.avatar.centered {
  margin: 0 auto;
}

.admin-info {
  flex: 1;
  min-width: 0;
}

.admin-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.admin-dropdown-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 1024px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  
  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
  }
}
</style>
