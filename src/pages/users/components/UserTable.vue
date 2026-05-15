<template>
  <AppTable 
    :columns="columns" 
    :data="data" 
    :loading="loading" 
    :page="page"
    :limit="limit"
    :total="total"
    selectable
    @update:page="$emit('update:page', $event)"
    @update:limit="$emit('update:limit', $event)"
    @selection-change="$emit('selection-change', $event)"
  >
    <template #user="{ row }">
      <div class="user-cell">
        <div class="avatar" v-if="!row.avatarUrl">{{ getInitials(row.name) }}</div>
        <img :src="row.avatarUrl" class="avatar-img" v-else />
        <div class="user-info">
          <div class="user-name">{{ row.name }}</div>
          <div class="user-handle">@{{ row.username }}</div>
        </div>
      </div>
    </template>
    
    <template #role="{ row }">
      <StatusBadge :status="row.role" :showDot="false" />
    </template>
    
    <template #phone="{ row }">
      <div class="verified-cell">
        {{ row.phone }}
        <CheckCircle class="verified-icon" v-if="row.verified" />
      </div>
    </template>
    
    <template #email="{ row }">
      <div class="email-cell">
        {{ row.email }}
      </div>
    </template>
    
    <template #city="{ row }">
      <div class="city-cell">
        <MapPin class="icon" />
        {{ row.city }}
      </div>
    </template>
    
    <template #status="{ row }">
      <StatusBadge :status="row.status" />
    </template>
    
    <template #joinedAt="{ row }">
      <div class="date-cell">
        <div>{{ formatDateStr(row.joinedAt).split(',')[0] }}</div>
        <div class="time-text">{{ formatDateStr(row.joinedAt).split(',')[1] }}</div>
      </div>
    </template>
    
    <template #actions="{ row }">
      <UserActionMenu :user="row" @action="$emit('action', $event)" />
    </template>
  </AppTable>
</template>

<script setup>
import { CheckCircle, MapPin } from '@lucide/vue';
import AppTable from '../../../components/common/AppTable.vue';
import StatusBadge from '../../../components/common/StatusBadge.vue';
import UserActionMenu from './UserActionMenu.vue';
import { formatDate } from '../../../utils/formatters';

const props = defineProps({
  data: Array,
  loading: Boolean,
  page: Number,
  limit: Number,
  total: Number
});

defineEmits(['update:page', 'update:limit', 'selection-change', 'action']);

const columns = [
  { key: 'user', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'username', label: 'Username' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'City' },
  { key: 'status', label: 'Status' },
  { key: 'joinedAt', label: 'Joined On' },
  { key: 'actions', label: 'Actions' }
];

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatDateStr = (date) => formatDate(date);
</script>

<style scoped>
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar, .avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.avatar {
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.user-handle {
  font-size: 12px;
  color: var(--text-muted);
}

.verified-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.verified-icon {
  width: 14px;
  height: 14px;
  color: var(--success-color);
}

.city-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
}

.city-cell .icon {
  width: 14px;
  height: 14px;
}

.date-cell {
  font-size: 13px;
}

.time-text {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
