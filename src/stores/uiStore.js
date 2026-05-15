import { reactive } from 'vue';

export const uiStore = reactive({
  isSidebarCollapsed: false,
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
});
