<template>
  <div class="order-container">
    <Card v-for="order in orders" :key="order.id" class="order-card">
      <template #title>
        Order #{{ order.id }}
      </template>

      <template #content>
        <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
        <p><strong>Buyer:</strong> {{ order.buyer.name }} - {{ order.buyer.email }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Total:</strong> {{ formatPrice(order.totalAmount, order.totalAmount?._currency?._code) }}</p>

        <h4>Items:</h4>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            {{ item.name }} - {{ formatPrice(item.unitPrice?._amount) }}
          </li>
        </ul>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card';
import { PurchaseOrderService } from '@/order-operation-and-monitoring/services/purchase-order.service.js';
import userService from '@/authentication/services/user.service';

export default {
  name: 'SalesOrderComponent',
  components: { Card },
  data() {
    return {
      orders: []
    };
  },
  methods: {
    formatDate(date) {
      const raw = typeof date === 'object' && date._date ? date._date : date;
      return new Date(raw).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatPrice(amount = 0, currencyCode = 'PEN') {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2
      }).format(amount);
    },
    async loadOrders() {
      try {
        const response = await new PurchaseOrderService().getAll();
        const currentSupplierId = userService.getCurrentUserProfile()?.profileId;

        this.orders = response
            .filter(order => order.supplier?.profileId === currentSupplierId)
            .map(order => ({
              ...order,
              totalAmount: order.totalAmount?._amount ?? 0,
              date: order.date?._date ?? order.date
            }));

        console.log('📦 Órdenes recibidas por el proveedor:', this.orders);
      } catch (err) {
        console.error('❌ Error al cargar órdenes del proveedor:', err);
      }
    }
  },
  mounted() {
    this.loadOrders();
  }
};
</script>

<style scoped>
.order-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}
.order-card {
  padding: 1rem;
}
</style>
