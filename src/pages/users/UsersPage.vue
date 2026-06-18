<template>
  <div class="users-page">
    <div class="page-header">
      <div class="page-title">
        <h1>User Management</h1>
        <div class="page-subtitle">Manage all customers and shopkeepers on Neargrab.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline">
          <Download class="icon" /> Export Users
        </button>
        <button class="btn btn-primary">
          <Plus class="icon" /> Add User
        </button>
      </div>
    </div>

    <UserMetricGrid v-if="metrics" :totals="metrics" />
    
    <div class="table-container">
      <div v-if="errorMessage" class="error-banner">
        <span>{{ errorMessage }}</span>
        <button class="btn-close" @click="errorMessage = null">&times;</button>
      </div>
      <UserFilters @filter="handleFilter" />
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <UserTable 
        :data="users" 
        :loading="loading"
        :page="filters.page"
        :limit="filters.limit"
        :total="totalUsers"
        @update:page="filters.page = $event; loadUsers()"
        @update:limit="filters.limit = $event; loadUsers()"
        @selection-change="selectedUsers = $event"
        @action="handleAction"
      />
    </div>

    <ConfirmDialog 
      v-if="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirmText="confirmModal.confirmText"
      :isDanger="confirmModal.isDanger"
      @confirm="executeAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { Download, Plus } from '@lucide/vue';
import { userService } from '../../services/userService';
import UserMetricGrid from './components/UserMetricGrid.vue';
import UserFilters from './components/UserFilters.vue';
import UserTable from './components/UserTable.vue';
import ConfirmDialog from '../../components/common/ConfirmDialog.vue';

const metrics = ref(null);
const users = ref([]);
const loading = ref(false);
const totalUsers = ref(0);
const selectedUsers = ref([]);
const errorMessage = ref(null);

const activeTab = ref('all');
const tabs = [
  { id: 'all', label: 'All Users' },
  { id: 'customer', label: 'Customers' },
  { id: 'shopkeeper', label: 'Shopkeepers' },
  { id: 'verified', label: 'Verified Users' },
  { id: 'suspended', label: 'Suspended Users' }
];

const filters = reactive({
  search: '',
  role: 'all',
  status: 'all',
  city: 'all',
  page: 1,
  limit: 10
});

const confirmModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  isDanger: false,
  actionData: null
});

const loadMetrics = async () => {
  try {
    metrics.value = await userService.getMetrics();
  } catch (err) {
    console.error('Failed to load user metrics', err);
  }
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const { data, total } = await userService.listUsers(filters);
    users.value = data;
    totalUsers.value = total;
  } catch (err) {
    console.error('Failed to load users', err);
  } finally {
    loading.value = false;
  }
};

const handleFilter = (newFilters) => {
  Object.assign(filters, newFilters);
  filters.page = 1; // Reset to page 1 on filter change
  loadUsers();
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  filters.page = 1;
  
  // Reset other filters based on tab
  if (tabId === 'all') {
    filters.role = 'all';
    filters.status = 'all';
  } else if (tabId === 'customer' || tabId === 'shopkeeper') {
    filters.role = tabId;
    filters.status = 'all';
  } else if (tabId === 'suspended') {
    filters.status = 'suspended';
    filters.role = 'all';
  }
  
  loadUsers();
};

const handleAction = async ({ action, userId }) => {
  errorMessage.value = null;
  if (action === 'suspend-user') {
    confirmModal.title = 'Suspend User';
    confirmModal.message = 'Are you sure you want to suspend this user? They will not be able to log in.';
    confirmModal.confirmText = 'Suspend';
    confirmModal.isDanger = true;
    confirmModal.actionData = { action, userId };
    confirmModal.isOpen = true;
  } else if (action === 'delete-user') {
    confirmModal.title = 'Delete User';
    confirmModal.message = 'Are you sure you want to delete this user? This action cannot be undone.';
    confirmModal.confirmText = 'Delete';
    confirmModal.isDanger = true;
    confirmModal.actionData = { action, userId };
    confirmModal.isOpen = true;
  } else if (action === 'deactivate-user') {
    confirmModal.title = 'Deactivate User';
    confirmModal.message = 'Are you sure you want to deactivate this user? They will not be able to log in or use their account.';
    confirmModal.confirmText = 'Deactivate';
    confirmModal.isDanger = true;
    confirmModal.actionData = { action, userId };
    confirmModal.isOpen = true;
  } else if (action === 'verify-user') {
    loading.value = true;
    try {
      const user = users.value.find(u => u.id === userId);
      await userService.updateUser(userId, { status: 'active' });
      
      if (user && user.role === 'shopkeeper') {
        try {
          const shopsRes = await userService.listShops({ search: user.username });
          const shop = shopsRes.shops?.find(s => s.ownerId === userId);
          if (shop) {
            await userService.verifyShop(shop.id, {
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
              reason: 'Verified by administrator'
            });
          }
        } catch (shopErr) {
          console.error('Failed to auto-verify shopkeeper shop:', shopErr);
        }
      }
      
      await loadUsers();
      await loadMetrics();
    } catch (err) {
      console.error('Failed to verify user', err);
      errorMessage.value = err.message || 'Failed to verify user.';
    } finally {
      loading.value = false;
    }
  } else {
    console.log(`Action ${action} clicked for user ${userId}`);
  }
};

const closeConfirmModal = () => {
  confirmModal.isOpen = false;
  confirmModal.actionData = null;
};

const executeAction = async () => {
  const { action, userId } = confirmModal.actionData;
  errorMessage.value = null;
  loading.value = true;
  
  try {
    if (action === 'suspend-user') {
      await userService.updateUser(userId, { status: 'suspended' });
    } else if (action === 'deactivate-user') {
      await userService.updateUser(userId, { status: 'deactivated' });
    } else if (action === 'delete-user') {
      await userService.deleteUser(userId);
    }
    await loadUsers();
    await loadMetrics();
  } catch (err) {
    console.error(`Failed to execute ${action}`, err);
    errorMessage.value = err.message || `Failed to execute ${action}.`;
  } finally {
    loading.value = false;
    closeConfirmModal();
  }
};

onMounted(() => {
  loadMetrics();
  loadUsers();
});
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.error-banner {
  background-color: #FEF2F2;
  border: 1px solid var(--danger-color);
  color: #B91C1C;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  color: #B91C1C;
  cursor: pointer;
  padding: 0;
}
</style>
