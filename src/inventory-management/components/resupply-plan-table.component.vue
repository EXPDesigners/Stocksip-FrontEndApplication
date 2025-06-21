<template>
  <div class="resupply-plan-table">
    <table>
      <thead>
        <tr>
          <th>Products</th>
          <th>Frequency</th>
          <th>Expire</th>
          <th>State</th>
          <th>Actiones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.id">
          <td>{{ getProductosTexto(plan.productos) }}</td>
          <td>{{ plan.frecuencia }}</td>
          <td>{{ plan.fechaVencimiento }}</td>
          <td>{{ plan.estado }}</td>
          <td>
            <button @click.prevent="editarPlan(plan.id)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ResupplyPlanTable',
  props: {
    plans: {
      type: Array,
      required: true
    },
    productos: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    getProductosTexto(productos) {
      if (Array.isArray(productos)) {
        if (productos.length === 1) {
          const prod = this.productos.find(p => String(p.id) === String(productos[0]));
          return prod ? prod.name : '';
        } else if (productos.length > 1) {
          return 'Varios productos';
        } else {
          return '';
        }
      } else if (typeof productos === 'string') {
        return productos;
      }
      return '';
    },
    editarPlan(id) {
      this.$router.push(`/resupplies/${id}/plans/edit`);
    }
  }
}
</script>

<style scoped>
.resupply-plan-table table {
  width: 100%;
  border-collapse: collapse;
}
.resupply-plan-table th, .resupply-plan-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
.resupply-plan-table th {
  background: #f5f5f5;
}
</style> 