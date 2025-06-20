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
      <button class="toggle-btn" @click="toggleSidebar" v-tooltip="$t('toolbar.expand-contract')">
        <i class="pi pi-bars"></i>
      </button>

      <ul class="nav-list">
        <li>
          <router-link to="/dashboard" v-tooltip="$t('toolbar.dashboard')">
            <i class="pi pi-chart-bar"></i>
            <span v-if="isExpanded">{{ $t('toolbar.dashboard') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/warehouses" v-tooltip="$t('toolbar.inventory')">
            <i class="pi pi-warehouse"></i>
            <span v-if="isExpanded">{{$t('toolbar.inventory')}}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/alerts" v-tooltip="$t('toolbar.alerts')">
            <i class="pi pi-exclamation-triangle"></i>
            <span v-if="isExpanded">{{ $t('toolbar.alerts') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports" v-tooltip="$t('toolbar.reports')">
            <i class="pi pi-file"></i>
            <span v-if="isExpanded">{{ $t('toolbar.reports') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/orders" v-tooltip="$t('toolbar.order')">
            <i class="pi pi-shopping-cart"></i>
            <span v-if="isExpanded">{{ $t('toolbar.order')}}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" v-tooltip="$t('toolbar.storage')">
            <i class="pi pi-building"></i>
            <span v-if="isExpanded">{{ $t('toolbar.storage') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" v-tooltip="$t('toolbar.settings')">
            <i class="pi pi-cog"></i>
            <span v-if="isExpanded">{{ $t('toolbar.settings') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/profile" v-tooltip="$t('toolbar.profile')">
            <i class="pi pi-user"></i>
            <span v-if="isExpanded">{{ $t('toolbar.profile') }}</span>
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
  margin-left: 0.5rem;
  transition: margin-left 0.3s ease;
}

.sidenav.expanded + .content {
  margin-left: 200px;
}
</style>