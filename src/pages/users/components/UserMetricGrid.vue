<template>
  <div class="grid-metrics" v-if="totals">
    <MetricCard 
      title="Total Users" 
      :value="totals.totalUsers" 
      :trend="totals.totalUsersTrend" 
      iconVariant="primary"
    >
      <template #icon><Users class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Customers" 
      :value="totals.customers" 
      :trend="totals.customersTrend" 
      iconVariant="primary"
    >
      <template #icon><User class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Shopkeepers" 
      :value="totals.shopkeepers" 
      :trend="totals.shopkeepersTrend" 
      iconVariant="warning"
    >
      <template #icon><Store class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Suspended Users" 
      :value="totals.suspended" 
      :trend="totals.suspendedTrend" 
      iconVariant="danger"
    >
      <template #icon><UserX class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="New This Week" 
      :value="totals.newThisWeek" 
      :trend="totals.newThisWeekTrend" 
      iconVariant="success"
    >
      <template #icon><TrendingUp class="icon" /></template>
    </MetricCard>
  </div>
</template>

<script setup>
import { Users, User, Store, UserX, TrendingUp } from '@lucide/vue';
import MetricCard from '../../../components/common/MetricCard.vue';

defineProps({
  totals: Object
});
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
}
</style>
