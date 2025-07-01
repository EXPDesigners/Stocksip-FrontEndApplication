<template>
  <div class="resupply-plan-create-page">
    <side-navbar />
    <div class="main-content">
      <resupply-plan-create-and-edit
        :productos="productos"
        :initial-plan="plan"
        :edit-mode="true"
        @guardar="guardarPlan"
        @cancelar="cancelar"
      />
    </div>
  </div>
</template>

<script>
import SideNavbar from '@/public/components/side-navbar.vue';
import ResupplyPlanCreateAndEdit from '../components/resupply-plan-create-and-edit.component.vue';
import axios from 'axios';

export default {
  name: 'ResupplyPlanEditPage',
  components: { SideNavbar, ResupplyPlanCreateAndEdit },
  props: ['id'],
  data() {
    return {
      productos: [],
      plan: null
    }
  },
  async created() {
    const resProd = await axios.get('http://localhost:3000/products');
    this.productos = resProd.data;
    // Obtener todos los planes y filtrar por ID
    const resPlans = await axios.get('http://localhost:3000/resupplyPlans');
    this.plan = resPlans.data.find(p => String(p.id) === String(this.id));
  },
  methods: {
    async guardarPlan(planEditado) {
      // Recalculate frequency
      const fechaInicio = planEditado.fechaInicio;
      const fechaVencimiento = planEditado.fechaVencimiento;
      const diffDias = (new Date(fechaVencimiento) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24);
      let frecuencia = 'Semanal';
      if (diffDias < 7) {
        frecuencia = 'Semanal';
      } else if (diffDias < 21) {
        frecuencia = 'Quincenal';
      } else {
        frecuencia = 'Mensual';
      }

      const planParaGuardar = {
        ...planEditado,
        frecuencia: frecuencia
      };

      await axios.put(`http://localhost:3000/resupplyPlans/${this.id}`, planParaGuardar);
      this.$router.push('/resupplies');
    },
    cancelar() {
      this.$router.push('/resupplies');
    }
  }
}
</script>

<style>

</style>