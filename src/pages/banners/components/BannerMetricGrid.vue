<template>
  <div class="grid-metrics" v-if="totals">
    <MetricCard 
      title="Total Banners" 
      :value="totals.totalBanners" 
      :trend="totals.totalBannersTrend" 
      iconVariant="primary"
    >
      <template #icon><Image class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Active Banners" 
      :value="totals.activeBanners" 
      :trend="totals.activeBannersTrend" 
      iconVariant="success"
    >
      <template #icon><CheckCircle class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Pinned Banners" 
      :value="totals.pinnedBanners" 
      iconVariant="warning"
    >
      <template #icon><Pin class="icon" /></template>
      <template #trend>Across all cities</template>
    </MetricCard>

    <MetricCard 
      title="Total Views (This Month)" 
      :value="totals.totalViews" 
      :trend="totals.totalViewsTrend" 
      iconVariant="info"
    >
      <template #icon><Eye class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Clicks (This Month)" 
      :value="totals.totalClicks" 
      :trend="totals.totalClicksTrend" 
      iconVariant="info"
    >
      <template #icon><MousePointerClick class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="Revenue (This Month)" 
      :value="formatCurrency(totals.totalRevenue)" 
      :trend="totals.totalRevenueTrend" 
      iconVariant="success"
    >
      <template #icon><Wallet class="icon" /></template>
    </MetricCard>
  </div>
</template>

<script setup>
import { Image, CheckCircle, Pin, Eye, MousePointerClick, Wallet } from '@lucide/vue';
import MetricCard from '../../../components/common/MetricCard.vue';
import { formatCurrency } from '../../../utils/formatters';

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
