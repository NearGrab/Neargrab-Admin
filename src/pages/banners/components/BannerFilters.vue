<template>
  <div class="banner-filters">
    <div class="search-box">
      <Search class="search-icon" />
      <input 
        type="text" 
        placeholder="Search banners by title, shop name..."
        v-model="filters.search"
        @input="emitChange"
      />
    </div>
    
    <div class="filter-controls">
      <select v-model="filters.city" @change="emitChange">
        <option value="all">All Cities</option>
        <option value="Surat">Surat</option>
        <option value="Navsari">Navsari</option>
        <option value="Valsad">Valsad</option>
        <option value="Vapi">Vapi</option>
        <option value="Bharuch">Bharuch</option>
      </select>
      
      <select v-model="filters.section" @change="emitChange">
        <option value="all">All Sections</option>
        <option value="top_hero">Top Hero</option>
        <option value="top_carousel">Top Carousel</option>
        <option value="middle_banner">Middle Banner</option>
        <option value="bottom_banner">Bottom Banner</option>
      </select>
      
      <select v-model="filters.status" @change="emitChange">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="pinned">Pinned</option>
        <option value="scheduled">Scheduled</option>
        <option value="draft">Draft</option>
        <option value="expired">Expired</option>
      </select>
      
      <select v-model="filters.device" @change="emitChange">
        <option value="all">All Devices</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
      </select>
      
      <button class="btn btn-outline filter-btn">
        <Filter class="icon" />
        More Filters
      </button>
      
      <button class="btn btn-ghost reset-btn" @click="resetFilters">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Search, Filter } from '@lucide/vue';

const emit = defineEmits(['filter']);

const filters = reactive({
  search: '',
  city: 'all',
  section: 'all',
  status: 'all',
  device: 'all'
});

const emitChange = () => {
  emit('filter', { ...filters });
};

const resetFilters = () => {
  filters.search = '';
  filters.city = 'all';
  filters.section = 'all';
  filters.status = 'all';
  filters.device = 'all';
  emitChange();
};
</script>

<style scoped>
.banner-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
  position: relative;
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

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 40px;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-btn {
  gap: 6px;
}

.filter-btn .icon {
  width: 16px;
  height: 16px;
}

.reset-btn {
  color: var(--primary-color);
  font-weight: 500;
}

@media (max-width: 1200px) {
  .filter-controls {
    flex-wrap: wrap;
  }
}

@media (max-width: 1024px) {
  .banner-filters {
    flex-direction: column;
  }
}
</style>
