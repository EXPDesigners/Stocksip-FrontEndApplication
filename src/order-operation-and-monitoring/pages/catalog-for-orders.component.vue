<template>
  <div>
    <div class="provider-input">
      <span class="p-float-label">
        <label for="providerEmail">Supplier email</label>
        <InputText id="providerEmail" class="InputText" v-model="providerEmail" placeholder="supplier@example.com" />
      </span>
      <Button label="Search" icon="pi pi-search" class="search-btn" @click="loadProviderCatalogs" />
    </div>

    <div class="market-container">
      <Card
          v-for="catalog in catalogs"
          :key="catalog.id"
          class="catalog-card"
      >
        <template #title>
          <div class="catalog-name">
            {{ catalog.name }}
          </div>
        </template>
        <template #subtitle>Publicado el {{ formatDate(catalog.dateCreated) }}
          <div class="catalog-content">
            <Button label="See all products" icon="pi pi-eye" text @click="loadItems(catalog.id)" />
            <ul v-if="selectedItems[catalog.id] !== undefined">
              <li v-if="selectedItems[catalog.id].length === 0">No hay productos en este catálogo</li>
              <li v-for="item in selectedItems[catalog.id]" :key="item.id" class="product-info">
                <h4>{{ item.name }}</h4>
              </li>
            </ul>
          </div>
        </template>

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
      try {
        const items = await catalogService.getCatalogItems(catalogId);

        // Forzar reactividad total
        selectedItems.value = {
          ...selectedItems.value,
          [catalogId]: items
        };

        console.log('Productos cargados para catálogo', catalogId, items);
      } catch (err) {
        console.error('Error al cargar productos del catálogo:', err);
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

        catalogs.value = await catalogService.getPublishedCatalogsByProfile(profile.profileId);
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
  flex-direction: column;
  .InputText {
    background-color: white;
    color: gray;
    border: 3px solid #5A033A;
    border-radius: 45px;
  }
  label {
    color: #5A033A;
    font-weight: bold;
    font-size: 1.3rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
}

.p-float-label {
  background-color: #f7eddc;
  display: flex;
  flex-direction: column;
}

.product-info {
  margin: 0.5rem 0;
}

.search-btn {
  height: 42px;
  background-color: #5A033A;
  color: white;
  width: fit-content;
  font-size: 1.2rem;
  border-radius: 45px;
  border: none;
}
.search-btn:hover {
  background-color: #6E0081;
  color: white;
}
.search-btn:focus {
  border-color: #6E0081;
  color: white;
}

.market-container {
  .catalog-card {
    background-color: #fff;
    border: 3px solid #5A033A;
    border-radius: 35px;
  }
  .catalog-name {
    font-size: 1.5rem;
    color: #5A033A;
    font-weight: bold;
  }
  .catalog-content {
    align-items: center;
    margin-top: 1rem;
    color: gray;
    padding: 2rem;
    Button {
      color: #6E0081;
      border-radius: 45px;
      border: none;
      padding: 0.5rem 1.5rem;
      font-size: 1.2rem;
    }
  }
}

.new-order {
  background-color: #5A033A;
  color: white;
  border-radius: 45px;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
}
.new-order:hover {
  background-color: #6E0081;
  color: white;
}

</style>
