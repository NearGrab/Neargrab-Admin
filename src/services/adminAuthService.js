import usersData from '../data/user.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminAuthService = {
  async login(email, password) {
    await delay(800); // Simulate network latency
    const admin = usersData.admins.find(a => a.email === email && a.password === password && a.status === 'active');
    
    if (admin) {
      // In a real app, we'd receive a token here
      const { password, ...adminData } = admin;
      localStorage.setItem('neargrab_admin_id', admin.id);
      return { success: true, admin: adminData };
    } else {
      throw new Error('Invalid email or password.');
    }
  },

  async logout() {
    await delay(300);
    localStorage.removeItem('neargrab_admin_id');
    return { success: true };
  },

  async getCurrentAdmin() {
    await delay(300);
    const id = localStorage.getItem('neargrab_admin_id');
    if (!id) return null;
    
    const admin = usersData.admins.find(a => a.id === id);
    if (admin) {
      const { password, ...adminData } = admin;
      return adminData;
    }
    return null;
  }
};
