<template>
  <div class="right-panels">
    <AppCard class="pinned-panel">
      <div class="panel-header">
        <div class="panel-title">
          <Pin class="icon-title" />
          <h3>Pinned Products</h3>
        </div>
        <p class="panel-desc">Manage pinned products by city</p>
      </div>
      
      <div class="city-selector">
        <select v-model="selectedCity">
          <option v-for="rule in rules" :key="rule.city" :value="rule.city">
            {{ rule.city }}
          </option>
        </select>
        <div class="pin-limit" v-if="currentRule">
          {{ currentPins }} / {{ currentRule.pinLimit }}
        </div>
      </div>
      
      <div class="manage-pins">
        <h4>Manage Pins</h4>
        <div class="pin-list" v-if="pinnedProducts.length > 0">
          <div class="pin-item" v-for="(product, index) in pinnedProducts" :key="product.id">
            <div class="pin-index">{{ index + 1 }}</div>
            <div class="pin-img">
              <img :src="product.imageUrl" v-if="product.imageUrl" />
              <Package class="placeholder-icon" v-else />
            </div>
            <div class="pin-info">
              <div class="pin-name">{{ product.name }}</div>
              <div class="pin-shop">{{ product.shopName }}</div>
            </div>
            <button class="unpin-btn" @click="$emit('unpin', product.id)">
              <Pin class="icon" />
            </button>
          </div>
        </div>
        <div class="empty-pins" v-else>
          No pinned products in {{ selectedCity }}
        </div>
        
        <button class="btn btn-outline view-all-btn">
          View All Pinned ({{ totalPinned }})
        </button>
      </div>
    </AppCard>

    <AppCard class="bulk-actions-panel">
      <div class="panel-header">
        <h3>Bulk Actions</h3>
        <p class="panel-desc">Perform actions on multiple products</p>
      </div>
      <select class="bulk-select" v-model="bulkAction">
        <option value="">Select Action</option>
        <option value="approve">Approve Selected</option>
        <option value="delete">Delete Selected</option>
        <option value="mark_out_of_stock">Mark Out of Stock</option>
      </select>
      <button 
        class="btn btn-primary w-full mt-3" 
        :disabled="!bulkAction || selectedCount === 0"
        @click="$emit('bulk-action', bulkAction)"
      >
        Apply to Selected ({{ selectedCount }})
      </button>
    </AppCard>

    <AppCard class="quick-actions-panel">
      <div class="panel-header">
        <h3>Quick Actions</h3>
      </div>
      <div class="quick-grid">
        <button class="quick-btn">
          <PlusCircle class="quick-icon" />
          <span>Add Product</span>
        </button>
        <button class="quick-btn">
          <UploadCloud class="quick-icon" />
          <span>Import Products</span>
        </button>
        <button class="quick-btn">
          <Layers class="quick-icon" />
          <span>Category Mgmt.</span>
        </button>
        <button class="quick-btn">
          <Tag class="quick-icon" />
          <span>Brand Mgmt.</span>
        </button>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Pin, Package, PlusCircle, UploadCloud, Layers, Tag } from '@lucide/vue';
import AppCard from '../../../components/common/AppCard.vue';

const props = defineProps({
  rules: { type: Array, default: () => [] },
  allProducts: { type: Array, default: () => [] },
  selectedCount: { type: Number, default: 0 }
});

const emit = defineEmits(['unpin', 'bulk-action']);

const selectedCity = ref('');
const bulkAction = ref('');

watch(() => props.rules, (newRules) => {
  if (newRules.length > 0 && !selectedCity.value) {
    selectedCity.value = newRules[0].city;
  }
}, { immediate: true });

const currentRule = computed(() => {
  return props.rules.find(r => r.city === selectedCity.value);
});

const pinnedProducts = computed(() => {
  return props.allProducts
    .filter(p => p.city === selectedCity.value && p.isPinned)
    .slice(0, 5); // Just show top 5 in this side panel
});

const currentPins = computed(() => {
  return props.allProducts.filter(p => p.city === selectedCity.value && p.isPinned).length;
});

const totalPinned = computed(() => {
  return props.allProducts.filter(p => p.isPinned).length;
});
</script>

<style scoped>
.right-panels {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-header {
  margin-bottom: 16px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.panel-title h3 {
  margin: 0;
  font-size: 16px;
}

.icon-title {
  width: 18px;
  height: 18px;
}

.panel-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.panel-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.city-selector select {
  flex: 1;
}

.pin-limit {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface-sunken);
  padding: 6px 10px;
  border-radius: 6px;
}

.manage-pins h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.pin-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background: var(--bg-surface-sunken);
}

.pin-index {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  width: 16px;
  text-align: center;
}

.pin-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: white;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pin-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.pin-info {
  flex: 1;
  min-width: 0;
}

.pin-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pin-shop {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unpin-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.unpin-btn:hover {
  background: #e6f4ea;
}

.unpin-btn .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.empty-pins {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  padding: 20px 0;
  font-style: italic;
  margin-bottom: 16px;
}

.view-all-btn {
  width: 100%;
  color: var(--primary-color);
  font-weight: 500;
}

.bulk-select {
  width: 100%;
}

.w-full { width: 100%; }
.mt-3 { margin-top: 12px; }

.quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: var(--bg-surface-sunken);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.quick-btn span {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.quick-icon {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}
</style>
