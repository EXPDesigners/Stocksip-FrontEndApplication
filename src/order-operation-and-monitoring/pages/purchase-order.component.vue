<template>
  <div class="purchase-order-wrapper">
    <div class="actions">
      <router-link to="/catalog" class="new-order-button">
        Nueva Orden
      </router-link>
    </div>

    <PurchaseOrderListComponent :orders="orders" />
  </div>
</template>

<script>
import PurchaseOrderListComponent from "@/order-operation-and-monitoring/components/purchase-order-list.component.vue";
import { PurchaseOrderService } from "@/order-operation-and-monitoring/services/purchase-order.service.js";

export default {
  name: 'PurchaseOrder',
  components: {
    PurchaseOrderListComponent
  },
  data() {
    return {
      orders: []
    };
  },
  async created() {
    const orderService = new PurchaseOrderService();

    try {
      const response = await orderService.getAll();
      this.orders = response;
    } catch (err) {
      console.error('Error loading purchase orders', err);
    }
  }
};
</script>

<style scoped>
.actions {
  margin-bottom: 1rem;
  text-align: right;
}

.new-order-button {
  background-color: #1976d2;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}
</style>
