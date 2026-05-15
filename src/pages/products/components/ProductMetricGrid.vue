<template>
  <div class="grid-metrics" v-if="totals">
    <MetricCard 
      title="Total Products" 
      :value="totals.totalProducts" 
      :trend="totals.totalProductsTrend" 
      iconVariant="primary"
    >
      <template #icon><Package class="icon" /></template>
    </MetricCard>

    <MetricCard 
      title="In Stock Products" 
      :value="totals.inStock" 
      iconVariant="success"
    >
      <template #icon><CheckCircle class="icon" /></template>
      <template #trend>{{ totals.inStockPercent }}% of total</template>
    </MetricCard>

    <MetricCard 
      title="Out of Stock" 
      :value="totals.outOfStock" 
      iconVariant="danger"
    >
      <template #icon><XCircle class="icon" /></template>
      <template #trend>{{ totals.outOfStockPercent }}% of total</template>
    </MetricCard>

    <MetricCard 
      title="Products Pinned" 
      :value="totals.pinned" 
      iconVariant="info"
    >
      <template #icon><Pin class="icon" /></template>
      <template #trend>Across all cities</template>
    </MetricCard>

    <MetricCard 
      title="Shops with Products" 
      :value="totals.shopsWithProducts" 
      :trend="totals.shopsWithProductsTrend" 
      iconVariant="warning"
    >
      <template #icon><Store class="icon" /></template>
    </MetricCard>
  </div>
</template>

<script setup>
import { Package, CheckCircle, XCircle, Pin, Store } from '@lucide/vue';
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
