<template>
  <div class="catalog-grid">
    <div
        v-for="catalog in catalogs"
        :key="catalog.id"
        class="catalog-grid-tile"
    >
      <CatalogItem :catalog="catalog" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CatalogItem from "@/order-operation-and-monitoring/components/catalog-item.component.vue";
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'CatalogListComponent',
  components: {
    CatalogItem
  },
  setup() {
    const catalogs = ref([]);
    const catalogService = new CatalogService();

    onMounted(async () => {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) return;

      try {
        catalogs.value = await catalogService.getCatalogByProfile(currentUser.profileId);
      } catch (err) {
        console.error('Error fetching catalogs:', err);
      }
    });

    return {
      catalogs
    };
  }
};
</script>

<style scoped>
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.catalog-grid-tile {
  display: flex;
}
</style>
