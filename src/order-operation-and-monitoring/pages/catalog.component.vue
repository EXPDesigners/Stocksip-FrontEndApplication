<template>
  <div>
    <div v-if="isSupplier" class="add-catalog-btn">
      <Button label="New Catalog" icon="pi pi-plus" @click="goToNewCatalog" />
    </div>

    <CatalogList v-if="isSupplier" :catalogs="catalogs" />

    <CatalogForOrders v-if="isLiquorStoreOwner" :catalogCards="catalogs" />

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
      const currentProfile = userService.getCurrentUserProfile();
      console.log('Perfil actual:', currentProfile);

      if (!currentProfile?.role) {
        console.warn('Perfil no encontrado o sin rol');
        return;
      }

      profile.value = currentProfile;

      try {
        const role = profile.value.role.toLowerCase().trim();
        console.log('Rol normalizado:', role);

        if (role === 'supplier') {
          isSupplier.value = true;
          catalogs.value = await catalogService.getCatalogByProfile(profile.value.profileId);
          console.log('Catálogos del supplier:', catalogs.value);
        } else if (role === 'liquor store owner') {
          isLiquorStoreOwner.value = true;
          catalogs.value = await catalogService.getPublishedCatalogs();
          console.log('Catálogos publicados:', catalogs.value);
        } else {
          console.warn('Rol no reconocido:', role);
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
