<template>
  <AppCard class="system-summary">
    <h3>System Summary</h3>
    
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">Active Users</div>
        <div class="summary-value">{{ formatValue(data.activeUsers) }}</div>
        <div class="summary-status text-success">
          <span class="status-dot"></span> Online
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">Active Shops</div>
        <div class="summary-value">{{ formatValue(data.activeShops) }}</div>
        <div class="summary-status text-success">
          <span class="status-dot"></span> Online
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">In-Stock Products</div>
        <div class="summary-value">{{ formatValue(data.inStockProducts) }}</div>
        <div class="summary-status text-muted">
          76% of total
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">Out of Stock Products</div>
        <div class="summary-value">{{ formatValue(data.outOfStockProducts) }}</div>
        <div class="summary-status text-danger">
          24% of total
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">Pending Reviews</div>
        <div class="summary-value">{{ formatValue(data.pendingReviews) }}</div>
        <a href="#" class="summary-link">View Now</a>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">Open Tickets</div>
        <div class="summary-value">{{ formatValue(data.openTickets) }}</div>
        <a href="#" class="summary-link">View Now</a>
      </div>
      
      <div class="summary-item">
        <div class="summary-label">Flagged Content</div>
        <div class="summary-value">{{ formatValue(data.flaggedContent) }}</div>
        <a href="#" class="summary-link text-danger">Review Now</a>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '../../../components/common/AppCard.vue';

defineProps({
  data: Object
});

const formatValue = (val) => new Intl.NumberFormat('en-IN').format(val);
</script>

<style scoped>
.system-summary h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.summary-status, .summary-link {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.text-success { color: var(--success-color); }
.text-danger { color: var(--danger-color); }
.text-muted { color: var(--text-muted); }
.summary-link { color: var(--primary-color); }
</style>
