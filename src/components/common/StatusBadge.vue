<template>
  <div class="status-badge" :class="variantClass">
    <span class="dot" v-if="showDot"></span>
    <slot>{{ statusLabel }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: String,
  type: {
    type: String,
    default: 'user' // 'user', 'product', 'banner'
  },
  showDot: {
    type: Boolean,
    default: true
  }
});

const variantClass = computed(() => {
  const s = props.status?.toLowerCase();
  
  // User statuses
  if (s === 'active' || s === 'verified') return 'success';
  if (s === 'suspended' || s === 'deactivated' || s === 'deleted') return 'danger';
  if (s === 'pending') return 'warning';
  
  // Product statuses
  if (s === 'in_stock' || s === 'pinned') return 'success';
  if (s === 'out_of_stock' || s === 'flagged') return 'danger';
  if (s === 'pending_approval') return 'warning';
  
  // Banner statuses
  if (s === 'scheduled') return 'info';
  if (s === 'draft' || s === 'inactive') return 'neutral';
  if (s === 'expired') return 'danger';
  
  return 'neutral';
});

const statusLabel = computed(() => {
  if (!props.status) return '';
  return props.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.success { background-color: #ECFDF5; color: #059669; }
.danger { background-color: #FEF2F2; color: #DC2626; }
.warning { background-color: #FFFBEB; color: #D97706; }
.info { background-color: #EFF6FF; color: #2563EB; }
.neutral { background-color: #F3F4F6; color: #4B5563; }
</style>
