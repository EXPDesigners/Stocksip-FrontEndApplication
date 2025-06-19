<template>
  <div>
    <!-- 🟦 Botón para Suppliers -->
    <div v-if="isSupplier" class="add-catalog-btn">
      <Button label="New Catalog" icon="pi pi-plus" @click="goToNewCatalog" />
    </div>

    <!-- 🟨 Lista de Catálogos para Suppliers -->
    <CatalogList v-if="isSupplier" :catalogs="catalogs" />

    <!-- 🟩 Catálogos para órdenes (Licorerías) -->
    <CatalogForOrders v-else-if="isLiquorStoreOwner" :catalogCards="catalogs" />

    <!-- 🔴 Otros roles -->
    <p v-else>No tienes acceso a esta sección.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CatalogList from "@/order-operation-and-monitoring/components/catalog-list.component.vue";
import CatalogForOrders from "@/order-operation-and-monitoring/pages/catalog-for-orders.component.vue";
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import userService from "@/authentication/services/user.service.js"; // 👈 SIN "new"
import Button from 'primevue/button';

export default {
  name: 'CatalogComponent',
  components: {
    CatalogList,
    CatalogForOrders,
    Button
  },
  setup() {
    const router = useRouter();
    const catalogService = new CatalogService();

    const catalogs = ref([]);
    const profile = ref(null);
    const isSupplier = ref(false);
    const isLiquorStoreOwner = ref(false);

    const goToNewCatalog = () => {
      router.push('/catalog/new');
    };

    onMounted(async () => {
      const currentUser = userService.getCurrentUser();
      console.log('Usuario actual:', currentUser);

      if (!currentUser?.profile || !currentUser.profile.role) {
        console.warn('Perfil no encontrado o sin rol');
        return;
      }

      profile.value = currentUser.profile;
      console.log('Rol del perfil:', profile.value.role);

      try {
        if (profile.value.role === 'Supplier') {
          isSupplier.value = true;
          catalogs.value = await catalogService.getCatalogByProfile(profile.value.profileId);
        } else if (profile.value.role === 'Liquor Store Owner') {
          isLiquorStoreOwner.value = true;
          catalogs.value = await catalogService.getPublishedCatalogs();
        } else {
          console.warn('Rol no reconocido');
        }
      } catch (err) {
        console.error('Error al cargar catálogos:', err);
      }
    });

    return {
      catalogs,
      isSupplier,
      isLiquorStoreOwner,
      goToNewCatalog
    };
  }
};
</script>


<style scoped>
.add-catalog-btn {
  margin: 1rem;
}
</style>
