<template>
  <div class="purchase-list-card">
    <h2 class="recent-orders">Recent Orders</h2>

    <DataTable :value="orders" class="p-datatable-striped" :paginator="true" :rows="5">
      <Column field="id" header="ID">
        <template #body="{ data }">
          <span>{{ data.id }}</span>
        </template>
      </Column>

      <Column header="Date">
        <template #body="{ data }">
          <span>{{ formatDate(data.date) }}</span>
        </template>
      </Column>

      <Column field="status" header="Status">
        <template #body="{ data }">
          <span>{{ data.status }}</span>
        </template>
      </Column>

      <Column header="Products">
        <template #body="{ data }">
          <span>{{ data.totalItems !== undefined ? data.totalItems + ' products' : 'No totalItems' }}</span>
        </template>
      </Column>

      <Column header="Total">
        <template #body="{ data }">
          <span>{{ formatPrice(data.totalAmount) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  name: 'PurchaseOrderList',
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  components: {
    DataTable,
    Column
  },
  mounted() {
    console.log('Received orders:', this.orders);
  },
  methods: {
    formatPrice(amount) {
      if (typeof amount !== 'number' || !Number.isFinite(amount)) {
        console.warn('Invalid amount:', amount);
        return 'S/0.00';
      }
      return amount.toLocaleString('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      });
    },
    formatDate(date) {
      const d = typeof date === 'object' ? date._date ?? date : date;
      if (!d) {
        console.warn('Invalid date:', date);
        return 'Invalid date';
      }
      return new Date(d).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.purchase-list-card {
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.recent-orders {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #5A033A;
}
.p-datatable-striped {
  background-color: #f7eddc;
}
</style>
