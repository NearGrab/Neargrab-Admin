<template>
  <footer class="admin-footer">
    <div class="copyright">
      &copy; 2025 Neargrab. All rights reserved.
    </div>
    <div class="system-info">
      <span class="time">System Time: {{ formattedTime }}</span>
      <span class="version">v2.1.0</span>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const formattedTime = ref('');
let timer;

const updateTime = () => {
  const now = new Date();
  formattedTime.value = now.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 60000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.admin-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  color: #6b7280;
  font-size: 13px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-surface-sunken);
}

.system-info {
  display: flex;
  gap: 24px;
}

@media (max-width: 640px) {
  .admin-footer {
    flex-direction: column;
    gap: 8px;
    align-items: center;
    text-align: center;
  }
}
</style>
