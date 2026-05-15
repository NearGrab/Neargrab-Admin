<template>
  <div class="action-menu-container" @click.stop>
    <button class="action-trigger" @click="toggleMenu">
      <MoreHorizontal class="icon" />
    </button>
    
    <div class="action-dropdown" v-if="isOpen">
      <div class="action-group">
        <button class="action-item" @click="emitAction('edit-banner')">
          <Edit class="icon" /> Edit Banner
        </button>
        <button class="action-item" @click="emitAction('view-analytics')">
          <BarChart2 class="icon" /> View Analytics
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item" @click="emitAction('pin-banner')" v-if="banner.status !== 'pinned'">
          <Pin class="icon" /> Pin Banner
        </button>
        <button class="action-item" @click="emitAction('unpin-banner')" v-else>
          <PinOff class="icon" /> Unpin Banner
        </button>
        <button class="action-item" @click="emitAction('schedule-banner')">
          <Calendar class="icon" /> Schedule Banner
        </button>
      </div>
      
      <div class="action-group">
        <button class="action-item danger" @click="emitAction('deactivate-banner')" v-if="banner.status === 'active' || banner.status === 'pinned'">
          <PauseCircle class="icon" /> Deactivate Banner
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  MoreHorizontal, Edit, BarChart2, Pin, PinOff, Calendar, PauseCircle 
} from '@lucide/vue';

const props = defineProps({
  banner: Object
});

const emit = defineEmits(['action']);

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const emitAction = (action) => {
  emit('action', { action, bannerId: props.banner.id });
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
</style>
