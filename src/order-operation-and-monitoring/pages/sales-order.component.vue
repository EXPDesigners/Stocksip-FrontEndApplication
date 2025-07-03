<template>
  <SideNavbar>
    <ToolbarContent pageTitle="Orders" />
    <div class="order-container">
      <Card v-for="order in orders" :key="order.id" class="order-card">
        <template #title>
          <div class="order-title">
            Order #{{ order.id }}
          </div>
        </template>

        <template #content>
          <div class="order-content">
            <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
            <p><strong>Buyer:</strong> {{ order.buyer.name }} - {{ order.buyer.email }}</p>
            <p><strong>Status:</strong> {{ order.status }}</p>
            <p><strong>Total:</strong> {{ formatPrice(order.totalAmount) }}</p>

            <h4>Items:</h4>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - {{ formatPrice(item.unitPrice) }}
              </li>
            </ul>
          </div>
        </template>
      </Card>
    </div>
  </SideNavbar>
</template>

<script>
import Card from 'primevue/card';
import { PurchaseOrderService } from '@/order-operation-and-monitoring/services/purchase-order.service.js';
import userService from '@/authentication/services/user.service';
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";

export default {
  name: 'SalesOrderComponent',
  components: {SideNavbar, ToolbarContent, Card },
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
    formatPrice(amount = 0) {
      if (typeof amount !== 'number' || !Number.isFinite(amount)) {
        console.warn('Invalid amount:', amount);
        return 'S/0.00';
      }
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
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
              totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : 0,
              date: order.date?._date ?? order.date
            }));

        console.log('Orders received by the supplier:', this.orders);
      } catch (err) {
        console.error('Error loading supplier orders:', err);
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
  background-color: #f7eddc;
  min-height: 100vh;
}
.order-card {
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  .order-title {
    color: #5A033A;
  }
  .order-content {
    color: #4E4E4E;
  }
}


</style>
