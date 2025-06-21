<template>
  <div class="resupply-plan-dashboard">
    <side-navbar />
    <div class="dashboard-main">
      <div class="dashboard-header">
        <resupply-plan-header @nuevo-plan="irANuevoPlan" />
      </div>
      <div class="dashboard-content">
        <div class="main-content">
          <div class="table-header">
            <h2>Existing Plans</h2>
            <select>
              <option>Most recent</option>
            </select>
          </div>
          <resupply-plan-table :plans="plans" :productos="productos" />
        </div>
        <div class="side-content">
          <resupply-plan-alerts :expiringCount="expiringCount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ResupplyPlanHeader from '../components/resupply-plan-header.component.vue';
import ResupplyPlanTable from '../components/resupply-plan-table.component.vue';
import ResupplyPlanAlerts from '../components/resupply-plan-alerts.component.vue';
import resupplyPlanService from '../services/resupply-plan.service.js';
import axios from 'axios';

export default {
  name: 'ResupplyPlanDashboard',
  components: {
    SideNavbar,
    ResupplyPlanHeader,
    ResupplyPlanTable,
    ResupplyPlanAlerts
  },
  data() {
    return {
      plans: [],
      productos: [],
      expiringCount: 0
    }
  },
  async mounted() {
    this.plans = await resupplyPlanService.getAll();
    const expiring = await resupplyPlanService.getExpiringSoon();
    this.expiringCount = expiring.length;
    // Cargar productos
    const res = await axios.get('http://localhost:3000/products');
    this.productos = res.data;
  },
  methods: {
    async irANuevoPlan() {
      // Obtener todos los planes existentes
      const res = await axios.get('http://localhost:3000/resupplyPlans');
      const planes = res.data;
      // Buscar el mayor ID numérico
      const ids = planes.map(p => parseInt(p.id)).filter(n => !isNaN(n));
      const nextId = ids.length ? Math.max(...ids) + 1 : 1;
      this.$router.push(`/resupplies/${nextId}/plans/new`);
    }
  }
}
</script>

<style scoped>
.resupply-plan-dashboard {
  display: flex;
  background: #f6eddf;
  min-height: 100vh;
}
.dashboard-main {
  flex: 1;
  padding: 32px;
}
.dashboard-header {
  margin-bottom: 24px;
}
.dashboard-content {
  display: flex;
  gap: 24px;
}
.main-content {
  flex: 2;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 24px;
}
.side-content {
  flex: 1;
  min-width: 260px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
