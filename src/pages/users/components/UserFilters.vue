<template>
  <div class="user-filters">
    <div class="search-box">
      <Search class="search-icon" />
      <input 
        type="text" 
        placeholder="Search users by name, username, phone or email..."
        v-model="filters.search"
        @input="emitChange"
      />
    </div>
    
    <div class="filter-controls">
      <select v-model="filters.role" @change="emitChange">
        <option value="all">All Roles</option>
        <option value="customer">Customer</option>
        <option value="shopkeeper">Shopkeeper</option>
        <option value="admin">Admin</option>
      </select>
      
      <select v-model="filters.status" @change="emitChange">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="pending">Pending</option>
      </select>
      
      <select v-model="filters.city" @change="emitChange">
        <option value="all">All Cities</option>
        <option value="Surat">Surat</option>
        <option value="Navsari">Navsari</option>
        <option value="Valsad">Valsad</option>
        <option value="Vapi">Vapi</option>
        <option value="Bharuch">Bharuch</option>
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
import { reactive, watch } from 'vue';
import { Search, Filter } from '@lucide/vue';

const emit = defineEmits(['filter']);

const filters = reactive({
  search: '',
  role: 'all',
  status: 'all',
  city: 'all'
});

const emitChange = () => {
  emit('filter', { ...filters });
};

const resetFilters = () => {
  filters.search = '';
  filters.role = 'all';
  filters.status = 'all';
  filters.city = 'all';
  emitChange();
};
</script>

<style scoped>
.user-filters {
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

@media (max-width: 1024px) {
  .user-filters {
    flex-direction: column;
  }
  .filter-controls {
    flex-wrap: wrap;
  }
}
</style>
