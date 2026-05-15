<template>
  <AppCard class="recent-activity">
    <div class="card-header">
      <h3>Recent Activity</h3>
      <a href="#" class="view-all">View All</a>
    </div>
    
    <div class="activity-list">
      <div class="activity-item" v-for="item in data" :key="item.id">
        <div class="activity-icon-wrapper" :class="item.type">
          <Store v-if="item.icon === 'store'" class="icon" />
          <User v-if="item.icon === 'user'" class="icon" />
          <Package v-if="item.icon === 'box'" class="icon" />
          <Star v-if="item.icon === 'star'" class="icon" />
          <Banknote v-if="item.icon === 'banknote'" class="icon" />
        </div>
        <div class="activity-content">
          <div class="activity-title">{{ item.title }}</div>
          <div class="activity-desc">
            {{ item.desc }}
            <span class="rating" v-if="item.type === 'review_submitted'">
              <Star class="star-icon" fill="currentColor" /> 4.5
            </span>
          </div>
        </div>
        <div class="activity-time">{{ item.time }}</div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { Store, User, Package, Star, Banknote } from '@lucide/vue';
import AppCard from '../../../components/common/AppCard.vue';

defineProps({
  data: Array
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.view-all {
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-color);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon-wrapper.shop_registered { background-color: #e6f4ea; color: #0B4A26; }
.activity-icon-wrapper.user_registered { background-color: #e0f2fe; color: #0369a1; }
.activity-icon-wrapper.product_added { background-color: #fee2e2; color: #dc2626; }
.activity-icon-wrapper.review_submitted { background-color: #d1fae5; color: #059669; }
.activity-icon-wrapper.payout_processed { background-color: #dcfce7; color: #16a34a; }

.icon {
  width: 16px;
  height: 16px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.activity-desc {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating {
  color: #F59E0B;
  display: flex;
  align-items: center;
  gap: 2px;
}

.star-icon {
  width: 12px;
  height: 12px;
}

.activity-time {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
