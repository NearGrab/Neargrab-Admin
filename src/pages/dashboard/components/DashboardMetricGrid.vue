<template>
  <div class="grid-metrics" v-if="totals">
    <MetricCard 
      title="Total Users" 
      :value="totals.totalUsers" 
      :trend="totals.totalUsersTrend" 
      iconVariant="primary"
    >
      <template #icon><User class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Total Shops" 
      :value="totals.totalShops" 
      :trend="totals.totalShopsTrend" 
      iconVariant="primary"
    >
      <template #icon><Store class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Total Products" 
      :value="totals.totalProducts" 
      :trend="totals.totalProductsTrend" 
      iconVariant="warning"
    >
      <template #icon><Package class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Total Reviews" 
      :value="totals.totalReviews" 
      :trend="totals.totalReviewsTrend" 
      iconVariant="warning"
    >
      <template #icon><Star class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Total Leads (Directions)" 
      :value="totals.totalLeads" 
      :trend="totals.totalLeadsTrend" 
      iconVariant="success"
    >
      <template #icon><MapPin class="icon" /></template>
    </MetricCard>
  </div>
</template>

<script setup>
import { User, Store, Package, Star, MapPin } from '@lucide/vue';
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
