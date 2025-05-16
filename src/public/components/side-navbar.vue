<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'side-navbar',
  setup() {
    const isExpanded = ref(false);
    const router = useRouter();

    const toggleSidebar = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isExpanded,
      toggleSidebar
    };
  }
};
</script>

<template>
  <div class="sidenav-container">
    <aside :class="['sidenav', { expanded: isExpanded }]">
      <button class="toggle-btn" @click="toggleSidebar" v-tooltip="'Expandir/Contraer'">
        <i class="pi pi-bars"></i>
      </button>

      <ul class="nav-list">
        <li>
          <router-link to="/dashboard" v-tooltip="'Dashboard'">
            <i class="pi pi-list"></i>
            <span v-if="isExpanded">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/inventory/id_i/products" v-tooltip="'Inventory'">
            <i class="pi pi-box"></i>
            <span v-if="isExpanded">Inventory</span>
          </router-link>
        </li>
        <li>
          <router-link to="/alerts" v-tooltip="'Alerts'">
            <i class="pi pi-exclamation-triangle"></i>
            <span v-if="isExpanded">Alerts</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports" v-tooltip="'Reports'">
            <i class="pi pi-file"></i>
            <span v-if="isExpanded">Reports</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" v-tooltip="'Orders'">
            <i class="pi pi-shopping-cart"></i>
            <span v-if="isExpanded">Shop</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" v-tooltip="'Settings'">
            <i class="pi pi-cog"></i>
            <span v-if="isExpanded">Settings</span>
          </router-link>
        </li>
        <li>
          <router-link to="/profile" v-tooltip="'Profile'">
            <i class="pi pi-user"></i>
            <span v-if="isExpanded">Profile</span>
          </router-link>
        </li>
      </ul>
    </aside>
    <main class="content">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.sidenav-container {
  height: 100%;
  display: flex;
  background-color: #F7EDDC;
}

.sidenav {
  background-color: #26021D;
  overflow: hidden;
  transition: width 0.3s ease;
  width: 64px;
  min-height: 100vh;
  padding-top: 16px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

.sidenav.expanded {
  width: 200px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li a {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.nav-list li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-list li a i {
  font-size: 1.5rem;
  margin-right: 16px;
  transition: color 0.3s ease;
}

.nav-list li a:hover i {
  color: #880E4F;
}

.nav-list li a span {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  margin: 0 0 16px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover i {
  color: #880E4F;
}

.toggle-btn i {
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  margin-left: 64px;
  transition: margin-left 0.3s ease;
}

.sidenav.expanded + .content {
  margin-left: 200px;
}
</style>