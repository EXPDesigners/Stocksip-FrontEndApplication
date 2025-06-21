<template>
  <div class="resupply-plan-create-page">
    <side-navbar />
    <div class="main-content">
      <resupply-plan-create-and-edit :productos="productos" @guardar="guardarPlan" @cancelar="cancelar" />
    </div>
  </div>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ResupplyPlanCreateAndEdit from '../components/resupply-plan-create-and-edit.component.vue';
import axios from 'axios';

export default {
  name: 'ResupplyPlanCreatePage',
  components: { SideNavbar, ResupplyPlanCreateAndEdit },
  data() {
    return {
      productos: []
    }
  },
  async created() {
    const response = await axios.get('http://localhost:3000/products');
    // Extraer solo id y name, sin repeticiones
    const unique = {};
    response.data.forEach(p => { if (!unique[p.id]) unique[p.id] = p.name; });
    this.productos = Object.entries(unique).map(([id, name]) => ({ id, name }));
  },
  methods: {
    async guardarPlan(plan) {
      // Obtener todos los planes existentes
      const res = await axios.get('http://localhost:3000/resupplyPlans');
      const planes = res.data;
      // Buscar el mayor ID numérico
      const ids = planes.map(p => parseInt(p.id)).filter(n => !isNaN(n));
      const nextId = ids.length ? Math.max(...ids) + 1 : 1;
      // Guardar productos como array de IDs
      const productosArr = plan.productos ? plan.productos.map(id => String(id)) : [];
      // Calcular frecuencia
      const fechaInicio = plan.fechaInicio;
      const fechaVencimiento = plan.fechaVencimiento;
      const diffDias = (new Date(fechaVencimiento) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24);
      let frecuencia = 'Semanal';
      if (diffDias < 7) frecuencia = 'Semanal';
      else if (diffDias < 21) frecuencia = 'Quincenal';
      else frecuencia = 'Mensual';
      // Crear el nuevo plan con todos los campos
      const nuevoPlan = {
        id: String(nextId),
        licoreria: plan.licoreria,
        productos: productosArr,
        cantidad: plan.cantidad,
        fechaInicio,
        fechaVencimiento,
        frecuencia,
        estado: 'Activo'
      };
      await axios.post('http://localhost:3000/resupplyPlans', nuevoPlan);
      this.$router.push('/resupplies');
    },
    cancelar() {
      this.$router.push('/resupplies');
    }
  }
}
</script>

<style scoped>
.resupply-plan-create-page {
  display: flex;
  min-height: 100vh;
  background: #f6eddf;
}
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}
</style> 