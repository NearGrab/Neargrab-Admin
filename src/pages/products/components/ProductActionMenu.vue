<template>
  <div class="action-menu-container" @click.stop v-if="hasProductPermission">
    <button class="action-trigger" @click="toggleMenu">
      <MoreHorizontal class="icon" />
    </button>
    
    <div class="action-dropdown" v-if="isOpen">
      <div class="action-group">
        <button class="action-item" @click="emitAction('edit-product')">
          <Edit class="icon" /> Edit Product
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item success" @click="emitAction('approve-product')" v-if="product.status === 'pending_approval'">
          <CheckCircle class="icon" /> Approve Product
        </button>
        <button class="action-item warning" @click="emitAction('flag-product')" v-if="product.status !== 'flagged'">
          <Flag class="icon" /> Flag Product
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item" @click="emitAction('pin-product')" v-if="!product.isPinned">
          <Pin class="icon" /> Pin Product
        </button>
        <button class="action-item" @click="emitAction('unpin-product')" v-else>
          <PinOff class="icon" /> Unpin Product
        </button>
        <button class="action-item" @click="emitAction('mark-out-of-stock')" v-if="product.stockStatus === 'in_stock'">
          <XCircle class="icon" /> Mark Out of Stock
        </button>
        <button class="action-item" @click="emitAction('mark-in-stock')" v-if="product.stockStatus === 'out_of_stock'">
          <CheckCircle class="icon" /> Mark In Stock
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item danger" @click="emitAction('delete-product')">
          <Trash2 class="icon" /> Delete Product
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  MoreHorizontal, Edit, CheckCircle, Flag, Pin, PinOff, XCircle, Trash2 
} from '@lucide/vue';
import { useAdminSessionStore } from '../../../stores/adminSessionStore';

const props = defineProps({
  product: Object
});

const emit = defineEmits(['action']);

const isOpen = ref(false);
const sessionStore = useAdminSessionStore();

const hasProductPermission = computed(() => {
  const role = sessionStore.state.admin?.role;
  return ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN'].includes(role);
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const emitAction = (action) => {
  emit('action', { action, productId: props.product.id });
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

.action-item.danger { color: var(--danger-color); }
.action-item.danger:hover { background-color: #FEF2F2; }

.action-item.success { color: var(--success-color); }
.action-item.success:hover { background-color: #ECFDF5; }

.action-item.warning { color: var(--warning-color); }
.action-item.warning:hover { background-color: #FFFBEB; }
</style>
