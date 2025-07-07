<template>
  <SideNavbar>
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
            <p><strong>Buyer:</strong> {{ order.buyer.email }}</p>
            <p>
              <strong>Status:</strong>
              <span :class="'st-' + order.status">{{ order.status }}</span>
              <Button
                  size="small"
                  icon="pi pi-pencil"
                  text
                  @click="openStatusDialog(order)"
              />
            </p>
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

    <Dialog
        v-model:visible="showDialog"
        modal
        header="Change order status"
        :style="{ width: '25rem' }"
    >
      <div class="p-fluid">
        <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a status"
        />

        <div class="dlg-actions">
          <Button label="Cancel" severity="secondary" @click="showDialog=false" />
          <Button label="Save" icon="pi pi-check" @click="applyStatusChange" />
        </div>
      </div>
    </Dialog>
  </SideNavbar>
</template>

<script>
import { useAuthenticationStore } from '@/authentication/services/authentication.store.js';
import { PurchaseOrderService }   from '@/order-operation-and-monitoring/services/purchase-order.service.js';

import SideNavbar     from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';
import Card           from 'primevue/card';
import Button         from 'primevue/button';
import Dialog         from 'primevue/dialog';
import Dropdown       from 'primevue/dropdown';

export default {
  name: 'SalesOrderComponent',
  components: {
    SideNavbar,
    ToolbarContent,
    Card,
    Button,
    Dialog,
    Dropdown
  },

  data() {
    return {
      orders: [],
      showDialog: false,
      currentOrder: null,
      selectedStatus: null,
      statusOptions: [
        { label: 'Received',  value: 0 },
        { label: 'InProcess', value: 1 },
        { label: 'Arrived',   value: 2 },
        { label: 'Canceled',  value: 3 }
      ]
    };
  },

  methods: {
    formatDate(date) {
      const raw = typeof date === 'object' && date?._date ? date._date : date;
      return raw
          ? new Date(raw).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Fecha inválida';
    },

    formatPrice(amount = 0) {
      return Number.isFinite(amount)
          ? amount.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 })
          : 'S/0.00';
    },

    async loadOrders() {
      try {
        const supplierAccountId = useAuthenticationStore().account?.accountId;
        if (!supplierAccountId) return;

        const resp = await new PurchaseOrderService().getAll({ supplierAccountId });
        this.orders = resp.map(o => ({
          ...o,
          totalAmount: Number(o.totalAmount) || 0,
          date: o.date?._date ?? o.date
        }));

        console.log('Orders received by the supplier:', this.orders);
      } catch (e) {
        console.error('Error loading supplier orders:', e);
      }
    },

    openStatusDialog(order) {
      if (order.status === 'Canceled') {
        alert('No puedes cambiar el estado de una orden cancelada.');
        return;
      }
      this.currentOrder   = order;
      this.selectedStatus = this.statusOptions.find(o => o.label === order.status)?.value ?? null;
      this.showDialog     = true;
    },

    async applyStatusChange() {
      if (!this.currentOrder || this.selectedStatus == null) return;

      try {
        const svc = new PurchaseOrderService();
        await svc.updateStatus(this.currentOrder.id, this.selectedStatus);
        this.currentOrder.status = this.statusOptions.find(opt => opt.value === this.selectedStatus).label;
        this.showDialog = false;
      } catch (e) {
        console.error('Error updating status', e);
        alert('No se pudo cambiar el estado.');
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
