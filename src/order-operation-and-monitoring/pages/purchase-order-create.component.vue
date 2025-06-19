<template>
  <div class="purchase-order-container">
    <h2>🧪 Purchase Order Create</h2>
    <p><strong>Catalog ID:</strong> {{ catalogId }}</p>

    <p>Total items: {{ catalogItems.length }}</p>

    <table>
      <thead>
      <tr>
        <th>Select</th>
        <th>Name</th>
        <th>Brand</th>
        <th>Price</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in catalogItems" :key="item.id">
        <td>
          <input type="checkbox" v-model="selectedItems[item.id]" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.brand }}</td>
        <td>{{ formatPrice(item.unitPrice) }}</td>
      </tr>
      </tbody>
    </table>

    <button class="create-btn" @click="createOrder">🛒 Create Order</button>
  </div>
</template>


<script>
import {ref, onMounted, h} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service';
import { Money } from '@/shared/model/money';
import { Currency } from '@/shared/model/currency';
import userService from '@/authentication/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import {PurchaseOrderService} from "@/order-operation-and-monitoring/services/purchase-order.service.js";
import profileService from "@/profile-management/services/profile.service.js";

export default {
  name: 'PurchaseOrderCreateComponent',
  components: {
    Card,
    Button,
    DataTable,
    Column,
    Checkbox
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const catalogService = new CatalogService();
    const orderService = new PurchaseOrderService();

    const catalogItems = ref([]);
    const selectedItems = ref({});

    const catalogId = +route.params.catalogId;

    const buyer = userService.getCurrentUserProfile();

    onMounted(async () => {
      try {
        catalog.value = await catalogService.getCatalogById(catalogId);
        console.log('[📦] Catálogo cargado:', catalog.value);

        if (catalog.value?.profileId) {
          supplier.value = await profileService.getProfileById(catalog.value.profileId);
          console.log('[👤] Perfil del proveedor cargado:', supplier.value);
        }
      } catch (err) {
        console.error('Error al cargar catálogo o proveedor:', err);
      }
    });

    const loadCatalogItems = async () => {
      console.log('[📦] Iniciando carga de ítems del catálogo...');

      try {
        const items = await catalogService.getCatalogItems(catalogId);
        console.log(`[✅] ${items.length} ítems recibidos del catálogo con ID: ${catalogId}`);

        catalogItems.value = items.map(item => {
          const rawPrice = item.unitPrice;

          let amount = 0;
          let currencyCode = 'PEN';
          let moneyInstance = null;

          try {
            if (typeof rawPrice === 'number') {
              amount = rawPrice;
            } else if (rawPrice && typeof rawPrice === 'object') {
              amount = Number(rawPrice._amount ?? rawPrice.amount);
              currencyCode =
                  rawPrice._currency?._code ??
                  rawPrice._currency?.code ??
                  rawPrice.currency ??
                  'PEN';
            }

            if (Number.isFinite(amount) && amount >= 0) {
              const currency = new Currency(currencyCode);
              moneyInstance = new Money({ amount, currency });
            } else {
              throw new Error('Invalid amount');
            }
          } catch (err) {
            console.warn(`[⚠️] Precio inválido en item ID ${item.id}:`, err.message);
            moneyInstance = null;
          }

          return {
            ...item,
            unitPrice: moneyInstance
          };
        });

        console.log(`[✅] Ítems procesados correctamente: ${catalogItems.value.length}`);
        console.table(catalogItems.value.map(i => ({
          id: i.id,
          name: i.name,
          brand: i.brand,
          price: i.unitPrice ? i.unitPrice.amount : 'INVALID'
        })));
      } catch (err) {
        console.error('[❌] Error al cargar ítems del catálogo:', err);
      }
    };

    const formatPrice = (unitPrice) => {
      if (!unitPrice) return 'Precio no disponible';
      return unitPrice.format?.('es-PE') ?? 'S/0.00';
    };


    const renderCheckbox = (rowData) => {
      return h(Checkbox, {
        modelValue: selectedItems.value[rowData.id] || false,
        'onUpdate:modelValue': value => {
          selectedItems.value[rowData.id] = value;
        },
        binary: true
      });
    };

    const createOrder = async () => {
      const profile = userService.getCurrentUserProfile();

      if (!profile) {
        alert('Usuario no autenticado');
        return;
      }

      const selectedItemIds = Object.keys(selectedItems.value).filter(id => selectedItems.value[id]);
      if (!selectedItemIds.length) {
        alert('Selecciona al menos un producto');
        return;
      }

      const items = catalogItems.value.filter(item => selectedItemIds.includes(item.id));
      const totalAmount = items.reduce((sum, item) => {
        const amount = item.unitPrice?.amount;
        return Number.isFinite(amount) && amount >= 0 ? sum + amount : sum;
      }, 0);

      if (!Number.isFinite(totalAmount) || totalAmount < 0) {
        console.warn('[⚠️] TotalAmount inválido:', totalAmount);
        alert('Error al calcular el monto total de la orden.');
        return;
      }

      const totalItems = items.length;

      let supplier = ref({});

      const catalog = await catalogService.getCatalogById(catalogId);
      const supplierProfile = catalog.profileId;

      if (supplierProfile) {
        try {
          supplier.value = await profileService.getProfileById(supplierProfile);
          console.log('[👤] Perfil del proveedor cargado:', supplier.value);
        } catch (err) {
          console.error('[❌] Error cargando perfil proveedor:', err);
        }
      }

      const order = {
        id: uuidv4(),
        date: { _date: new Date().toISOString() },
        status: 'Sent',
        buyer: {
          ...profile
        },
        supplier: {
          ...supplier.value
        },
        items,
        totalAmount: new Money({ amount: totalAmount, currency: new Currency('PEN') }),
        totalItems
      };


      try {
        await orderService.createPurchaseOrder(order);
        alert('Orden creada exitosamente');
        router.push('/orders');
      } catch (err) {
        console.error('Error creating order:', err);
      }
    };

    onMounted(loadCatalogItems);

    return {
      catalogId,
      catalogItems,
      selectedItems,
      formatPrice,
      renderCheckbox,
      createOrder
    };
  }
};
</script>

<style scoped>
.purchase-card {
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.purchase-card h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  color: #333;
}

.p-datatable-striped {
  margin-top: 1rem;
  border-radius: 6px;
  overflow: hidden;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #444;
  padding: 0.75rem;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.75rem;
}

.create-order-btn {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

</style>
