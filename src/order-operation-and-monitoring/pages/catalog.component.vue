<template>
  <SideNavbar>
    <ToolbarContent pageTitle="Catalogs" />
    <div class="container-catalogs">
      <div v-if="isSupplier" class="add-catalog-btn">
        <Button label="New Catalog" icon="pi pi-plus" @click="goToNewCatalog" />
      </div>

      <CatalogList v-if="isSupplier" :catalogs="catalogs" />

      <CatalogForOrders v-if="isLiquorStoreOwner" :catalogCards="catalogs" />
    </div>
  </SideNavbar>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CatalogList from "@/order-operation-and-monitoring/components/catalog-list.component.vue";
import CatalogForOrders from "@/order-operation-and-monitoring/pages/catalog-for-orders.component.vue";
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import userService from "@/authentication/services/user.service.js"; // 👈 SIN "new"
import Button from 'primevue/button';
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import SideNavbar from "@/public/components/side-navbar.vue";

export default {
  name: 'CatalogComponent',
  components: {
    SideNavbar,
    ToolbarContent,
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
      console.log('Current profile:', currentProfile);

      if (!currentProfile?.role) {
        console.warn('Profile not found or no role');
        return;
      }

      profile.value = currentProfile;

      try {
        const role = profile.value.role.toLowerCase().trim();
        console.log('Normalized role:', role);

        if (role === 'supplier') {
          isSupplier.value = true;
          catalogs.value = await catalogService.getCatalogByProfile(profile.value.profileId);
          console.log('Supplier catalogs:', catalogs.value);
        } else if (role === 'liquor store owner') {
          isLiquorStoreOwner.value = true;
          catalogs.value = await catalogService.getPublishedCatalogs();
          console.log('Published catalogs:', catalogs.value);
        } else {
          console.warn('Unrecognized role:', role);
        }
      } catch (err) {
        console.error('Error loading catalogs:', err);
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
  Button {
    background-color: #5A033A;
    color: white;
    border: none;
    border-radius: 45px;

  }
  Button:hover {
    background-color: #6E0081;
    color: white;
  }
}
.container-catalogs {
  background-color: #f7eddc;
  padding: 1rem;
}

</style>
