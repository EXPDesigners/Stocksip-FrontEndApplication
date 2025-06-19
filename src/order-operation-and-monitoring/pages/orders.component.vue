<template>
  <div>
    <SalesOrderComponent v-if="isSupplier" />
    <PurchaseOrderComponent v-else-if="isLiquorStoreOwner" />
    <p v-else class="unauthorized-message">No tienes acceso a esta sección.</p>
  </div>
</template>

<script>
import SalesOrderComponent from "@/order-operation-and-monitoring/pages/sales-order.component.vue";
import PurchaseOrderComponent from "@/order-operation-and-monitoring/pages/purchase-order.component.vue";
import userService from '@/authentication/services/user.service';

export default {
  name: 'OrdersComponent',
  components: {
    SalesOrderComponent,
    PurchaseOrderComponent
  },
  data() {
    return {
      isSupplier: false,
      isLiquorStoreOwner: false,
      profile: null
    };
  },
  mounted() {
    const currentProfile = userService.getCurrentUserProfile();

    if (!currentProfile?.role) {
      console.warn('Profile not found or no role');
      return;
    }

    this.profile = currentProfile;

    const role = this.profile.role.toLowerCase().trim();
    console.log('Role:', role);

    if (role === 'supplier') {
      this.isSupplier = true;
    } else if (role === 'liquor store owner') {
      this.isLiquorStoreOwner = true;
    } else {
      console.warn('Unrecognized role:', role);
    }
  }
};
</script>

<style scoped>
.unauthorized-message {
  color: red;
  font-weight: bold;
  margin-top: 2rem;
}
</style>
