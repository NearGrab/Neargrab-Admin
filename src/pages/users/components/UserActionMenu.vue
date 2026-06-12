<template>
  <div class="action-menu-container" @click.stop v-if="hasUserPermission">
    <button class="action-trigger" @click="toggleMenu">
      <MoreHorizontal class="icon" />
    </button>
    
    <div class="action-dropdown" v-if="isOpen">
      <div class="action-group">
        <button class="action-item" @click="emitAction('view-profile')">
          <User class="icon" /> View Profile
        </button>
        <button class="action-item" @click="emitAction('edit-user')">
          <Edit class="icon" /> Edit User
        </button>
        <button class="action-item" @click="emitAction('change-username')">
          <AtSign class="icon" /> Change Username
        </button>
        <button class="action-item" @click="emitAction('change-role')">
          <Shield class="icon" /> Change Role
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item success" @click="emitAction('verify-user')" v-if="!user.verified">
          <CheckCircle class="icon" /> Verify User
        </button>
        <button class="action-item danger" @click="emitAction('suspend-user')" v-if="user.status !== 'suspended'">
          <PauseCircle class="icon" /> Suspend User
        </button>
        <button class="action-item danger" @click="emitAction('deactivate-user')" v-if="user.status !== 'deactivated'">
          <XCircle class="icon" /> Deactivate User
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item" @click="emitAction('reset-password')">
          <Key class="icon" /> Reset Password
        </button>
        <button class="action-item danger" @click="emitAction('delete-user')">
          <Trash2 class="icon" /> Delete User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  MoreHorizontal, User, Edit, AtSign, Shield, 
  CheckCircle, PauseCircle, XCircle, Key, Trash2 
} from '@lucide/vue';
import { useAdminSessionStore } from '../../../stores/adminSessionStore';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['action']);

const isOpen = ref(false);
const sessionStore = useAdminSessionStore();

const hasUserPermission = computed(() => {
  const role = sessionStore.state.admin?.role;
  return ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'].includes(role);
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const emitAction = (action) => {
  emit('action', { action, userId: props.user.id });
  closeMenu();
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style scoped>
.action-menu-container {
  position: relative;
  display: inline-block;
}

.action-trigger {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-trigger:hover {
  background-color: var(--bg-surface-sunken);
  color: var(--text-primary);
}

.icon {
  width: 16px;
  height: 16px;
}

.action-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  width: 200px;
  z-index: 10;
}

.action-group {
  padding: 4px 0;
  border-bottom: 1px solid var(--border-color);
}

.action-group:last-child {
  border-bottom: none;
}

.action-item {
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-item:hover {
  background-color: var(--bg-surface-sunken);
  color: var(--text-primary);
}

.action-item.danger {
  color: var(--danger-color);
}

.action-item.danger:hover {
  background-color: #FEF2F2;
}

.action-item.success {
  color: var(--success-color);
}

.action-item.success:hover {
  background-color: #ECFDF5;
}
</style>
