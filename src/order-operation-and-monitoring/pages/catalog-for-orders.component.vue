<template>
  <div v-if="isAllowed">
    <!-- 🔍 Buscar proveedor -->
    <div class="provider-input">
      <span class="p-float-label">
        <InputText id="providerEmail" v-model="providerEmail" placeholder="supplier@example.com" />
        <label for="providerEmail">Supplier email</label>
      </span>
      <Button label="Search" icon="pi pi-search" class="search-btn" @click="loadProviderCatalogs" />
    </div>

    <!-- 🗂️ Lista de catálogos -->
    <div class="market-container">
      <Card
          v-for="catalog in catalogs"
          :key="catalog.id"
          class="catalog-card"
      >
        <template #title>{{ catalog.name }}</template>
        <template #subtitle>Publicado el {{ formatDate(catalog.dateCreated) }}</template>

        <Button label="See all products" icon="pi pi-eye" text @click="loadItems(catalog.id)" />

        <ul v-if="selectedItems[catalog.id]">
          <li v-for="item in selectedItems[catalog.id]" :key="item.id" class="product-info">
            <h4>{{ item.name }}</h4>
            <p>{{ item.brand }} · {{ item.content }}ml</p>
            <strong>{{ formatPrice(item.unitPrice) }}</strong>
          </li>
        </ul>

        <template #footer>
          <Button
              label="New Order"
              icon="pi pi-shopping-cart"
              @click="goToOrderPage(catalog.id)"
              class="new-order"
          />
        </template>
      </Card>
    </div>
  </div>

  <!-- 🛑 Si no tiene permisos -->
  <div v-else>
    <p>No tienes permiso para ver esta sección.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service.js';
import { Money } from '@/shared/model/money.js';
import { Currency } from '@/shared/model/currency.js';
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'CatalogForOrders',
  components: {
    Card,
    Button,
    InputText
  },
  setup() {
    const catalogs = ref([]);
    const selectedItems = ref({});
    const providerEmail = ref('');
    const isAllowed = ref(false);

    const catalogService = new CatalogService();
    const router = useRouter();
    const toast = useToast();

    onMounted(() => {
      const profile = userService.getCurrentUser();
      if (profile?.role === 'Liquor Store Owner') {
        isAllowed.value = true;
        catalogs.value = [];
      }
    });

    const loadItems = async (catalogId) => {
      if (!selectedItems.value[catalogId]) {
        try {
          const items = await catalogService.getCatalogItems(catalogId);
          selectedItems.value[catalogId] = items;
        } catch (err) {
          console.error('Error fetching items for catalog:', err);
        }
      }
    };

    const loadProviderCatalogs = async () => {
      if (!providerEmail.value) return;

      try {
        const profile = await userService.getProfileByEmail(providerEmail.value);
        if (!profile || profile.role !== 'Supplier') {
          toast.add({ severity: 'warn', summary: 'Proveedor no válido', life: 3000 });
          return;
        }

        const supplierCatalogs = await catalogService.getPublishedCatalogsByProfile(profile.profileId);
        catalogs.value = supplierCatalogs;
      } catch (err) {
        toast.add({ severity: 'error', summary: 'Error al buscar proveedor o catálogos', life: 3000 });
        console.error(err);
      }
    };

    const goToOrderPage = (catalogId) => {
      router.push(`/purchase-order/new/${catalogId}`);
    };

    const formatPrice = (unitPrice) => {
      const money = new Money(unitPrice.amount ?? 0, unitPrice.currency ?? new Currency('PEN'));
      return money.format('es-PE');
    };

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      catalogs,
      selectedItems,
      providerEmail,
      isAllowed,
      loadItems,
      loadProviderCatalogs,
      goToOrderPage,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.market-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-card {
  width: 100%;
  max-width: 500px;
}

.provider-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
}

.product-info {
  margin: 0.5rem 0;
}

.search-btn {
  height: 42px;
}
</style>
