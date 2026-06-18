<template>
  <div class="app-table-container">
    <table class="app-table">
      <thead>
        <tr>
          <th v-if="selectable" class="checkbox-col">
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
          </th>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="selectable ? columns.length + 1 : columns.length" class="text-center py-8">
            <div class="loading-spinner"></div> Loading data...
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="selectable ? columns.length + 1 : columns.length" class="text-center py-8 empty-state">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-else v-for="(row, index) in data" :key="row.id || index">
          <td v-if="selectable" class="checkbox-col">
            <input type="checkbox" :value="row.id" v-model="selectedIds" />
          </td>
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination" v-if="total > limit">
      <div class="pagination-info">
        Showing {{ (page - 1) * limit + 1 }}-{{ Math.min(page * limit, total) }} of {{ formatNumber(total) }} items
      </div>
      <div class="pagination-controls">
        <select class="limit-select" :value="limit" @change="$emit('update:limit', Number($event.target.value))">
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
        </select>
        
        <div class="page-buttons">
          <button class="page-btn" :disabled="page === 1" @click="$emit('update:page', page - 1)">
            <ChevronLeft class="icon" />
          </button>
          
          <button 
            v-for="p in totalPages" 
            :key="p"
            class="page-btn" 
            :class="{ active: p === page }"
            @click="$emit('update:page', p)"
            v-show="shouldShowPage(p)"
          >
            {{ p }}
          </button>
          
          <button class="page-btn" :disabled="page === totalPages" @click="$emit('update:page', page + 1)">
            <ChevronRight class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { formatNumber } from '../../utils/formatters';

const props = defineProps({
  columns: Array,
  data: Array,
  loading: Boolean,
  emptyMessage: { type: String, default: 'No items found.' },
  selectable: Boolean,
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 10 },
  total: { type: Number, default: 0 }
});

const emit = defineEmits(['update:page', 'update:limit', 'selection-change']);

const selectedIds = computed({
  get: () => [], // State should be managed by parent for proper reset
  set: (val) => emit('selection-change', val)
});

const allSelected = computed(() => {
  return props.data && props.data.length > 0 && selectedIds.value.length === props.data.length;
});

const toggleAll = (e) => {
  if (e.target.checked) {
    emit('selection-change', props.data.map(r => r.id));
  } else {
    emit('selection-change', []);
  }
};

const totalPages = computed(() => Math.ceil(props.total / props.limit) || 1);

const shouldShowPage = (p) => {
  if (totalPages.value <= 5) return true;
  if (p === 1 || p === totalPages.value) return true;
  if (Math.abs(p - props.page) <= 1) return true;
  return false;
};
</script>

<style scoped>
.app-table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  position: relative;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.app-table th {
  background-color: #f9fafb;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.app-table th:first-child {
  border-top-left-radius: 11px;
}

.app-table th:last-child {
  border-top-right-radius: 11px;
}

.app-table td {
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.app-table tbody tr:last-child td {
  border-bottom: none;
}

.app-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 11px;
}

.app-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 11px;
}

.app-table tbody tr:hover {
  background-color: #f9fafb;
}

.checkbox-col {
  width: 48px;
  padding-right: 0 !important;
}

.text-center { text-align: center; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }

.empty-state {
  color: var(--text-muted);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background-color: white;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
}

.pagination-info {
  font-size: 13px;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.limit-select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 13px;
}

.page-buttons {
  display: flex;
  gap: 4px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn .icon {
  width: 16px;
  height: 16px;
}
</style>
