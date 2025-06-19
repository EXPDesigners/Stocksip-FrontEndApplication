<template>
  <Card class="catalog-card">
    <template #title>
      <div class="catalog-header">
        <span class="catalog-info">
          <strong>Catalog Name:</strong> {{ catalog?.name }} |
          <strong>Created:</strong> {{ formatDate(catalog?.dateCreated) }}
        </span>
        <div class="actions">
          <Button label="Publish" @click="onPublish" severity="info" class="publish" />
          <Button label="Edit" @click="goToEdit" class="edit" />
        </div>
      </div>
    </template>

    <template #content>
      <h3>Products in catalog</h3>
      <DataTable
          :value="catalogItems"
          :paginator="true"
          :rows="5"
          :rowsPerPageOptions="[5, 10, 25]"
          class="p-datatable-striped"
      >
        <Column field="name" header="Name" />
        <Column field="content" header="Content">
          <template #body="{ data }">{{ data.content }}ml</template>
        </Column>
        <Column field="productType" header="Type" />
        <Column field="brand" header="Brand" />
        <Column header="Price">
          <template #body="{ data }">{{ formatPrice(data.unitPrice) }}</template>
        </Column>
        <Column header="Actions" style="width: 100px;">
          <template #body="{ data }">
            <Button icon="pi pi-trash" severity="danger" text @click="deleteItem(data.id)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { CatalogService } from "@/order-operation-and-monitoring/services/catalog.service.js";
import { Money } from '@/shared/model/money';
import { Currency } from '@/shared/model/currency';

export default {
  name: 'CatalogItem',
  props: {
    catalog: Object
  },
  components: {
    Card,
    Button,
    DataTable,
    Column
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const catalogService = new CatalogService();

    const catalogItems = ref([]);

    const loadCatalogItems = async () => {
      if (!props.catalog) return;

      try {
        const items = await catalogService.getCatalogItems(props.catalog.id);

        catalogItems.value = items.map(item => {
          const rawPrice = item.unitPrice;

          let amount = 0;
          let currencyCode = 'PEN';

          if (typeof rawPrice === 'number') {
            amount = rawPrice;
          } else if (rawPrice && typeof rawPrice === 'object') {
            amount = rawPrice._amount ?? rawPrice.amount ?? 0;
            currencyCode =
                rawPrice._currency?._code ??
                rawPrice._currency?.code ??
                rawPrice.currency ??
                'PEN';
          }

          if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
            amount = 0;
          }

          const money = new Money({
            amount,
            currency: new Currency(currencyCode)
          });

          return {
            ...item,
            unitPrice: money
          };
        });
      } catch (err) {
        console.error('Error loading catalog items:', err);
      }
    };

    watch(
        () => props.catalog,
        (newCatalog) => {
          if (newCatalog?.id) loadCatalogItems();
        },
        { immediate: true }
    );

    const deleteItem = async (id) => {
      const confirmed = confirm('Are you sure you want to remove this product from the catalog?');
      if (!confirmed) return;

      const itemToDelete = catalogItems.value.find(item => item.id === id);
      if (!itemToDelete) return;

      try {
        await catalogService.deleteCatalogItem(id);
        catalogItems.value = catalogItems.value.filter(item => item.id !== id);
        toast.add({ severity: 'info', summary: 'Removed product', life: 3000 });
      } catch (err) {
        console.error('Error al eliminar del backend:', err);
        toast.add({ severity: 'error', summary: 'Error deleting product', life: 3000 });
      }
    };

    const goToEdit = () => {
      if (props.catalog) {
        router.push(`/catalog/edit/${props.catalog.id}`);
      }
    };

    const onPublish = async () => {
      const c = props.catalog;
      if (!c?.id || !c.profileId || !c.name || !c.dateCreated) {
        toast.add({ severity: 'warn', summary: 'Incomplete catalog', detail: 'No se puede publicar.', life: 4000 });
        return;
      }

      try {
        await catalogService.updateCatalog({ ...c, isPublished: true });
        toast.add({ severity: 'success', summary: 'Published catalog', life: 3000 });
      } catch (err) {
        console.error('Error al publicar catálogo:', err);
        toast.add({ severity: 'error', summary: 'Error publishing', life: 3000 });
      }
    };

    const formatPrice = (unitPrice) => {
      if (!unitPrice) return 'No valid price';
      return unitPrice.format?.('es-PE') ?? 'S/0.00';
    };


    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      catalogItems,
      loadCatalogItems,
      deleteItem,
      goToEdit,
      onPublish,
      formatPrice,
      formatDate
    };
  }
};
</script>

<style scoped>
.catalog-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.catalog-container {
  padding: 2rem;
  background-color: #f5f0eb;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-info {
  font-size: 1.5rem;
  color: #263238;
  margin-bottom: 2rem;
}

.actions {
  margin-left: 0.5rem;
  margin-bottom: 2rem;
  .edit {
    background-color: #890E4F;
    color: white;
    font-size: 1.2rem;
    border: none;
    padding: 0.5rem 1.6rem;
    border-radius: 45px;
  }
  .edit:hover {
    background-color: #6E0081;
    color: white;
    border: none;
  }
  .publish {
    background-color: white;
    color: #890E4F;
    font-size: 1.2rem;
    border: #890E4F 4px solid;
    padding: 0.5rem 1.6rem;
    border-radius: 45px;
  }
  .publish:hover {
    border: #6E0081 4px solid;
    background-color: white;
    color: #6E0081;
  }
}

</style>
