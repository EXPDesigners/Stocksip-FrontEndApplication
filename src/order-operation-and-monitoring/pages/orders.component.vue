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
    console.log('👤 Perfil actual:', currentProfile);

    if (!currentProfile?.role) {
      console.warn('⚠️ Perfil no encontrado o sin rol');
      return;
    }

    this.profile = currentProfile;

    const role = this.profile.role.toLowerCase().trim();
    console.log('🎭 Rol normalizado:', role);

    if (role === 'supplier') {
      this.isSupplier = true;
    } else if (role === 'liquor store owner') {
      this.isLiquorStoreOwner = true;
    } else {
      console.warn('❓ Rol no reconocido:', role);
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
