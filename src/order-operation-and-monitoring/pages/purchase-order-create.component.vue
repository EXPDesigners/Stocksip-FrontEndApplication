<template>
  <SideNavbar>
    <ToolbarContent pageTitle="New Order" />
    <div class="purchase-order-container">
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
            <input class="check" type="checkbox" v-model="selectedItems[item.id]" />
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.brand }}</td>
          <td>{{ formatPrice(item.unitPrice) }}</td>
        </tr>
        </tbody>
      </table>

      <button class="create-btn" @click="createOrder">🛒 Create Order</button>
    </div>
  </SideNavbar>
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
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: 'PurchaseOrderCreateComponent',
  components: {
    ToolbarContent,
    SideNavbar,
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
        console.log('Catalog uploaded:', catalog.value);

        if (catalog.value?.profileId) {
          supplier.value = await profileService.getProfileById(catalog.value.profileId);
          console.log('Provider profile loaded:', supplier.value);
        }
      } catch (err) {
        console.error('Error loading catalog or supplier:', err);
      }
    });

    const loadCatalogItems = async () => {
      try {
        const items = await catalogService.getCatalogItems(catalogId);

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
            console.warn(`Invalid price on item ID: ${item.id}:`, err.message);
            moneyInstance = null;
          }

          return {
            ...item,
            unitPrice: moneyInstance
          };
        });

        console.log(`Items processed successfully: ${catalogItems.value.length}`);
        console.table(catalogItems.value.map(i => ({
          id: i.id,
          name: i.name,
          brand: i.brand,
          price: i.unitPrice ? i.unitPrice.amount : 'INVALID'
        })));
      } catch (err) {
        console.error('Error loading catalog items:', err);
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
        alert('Unauthenticated user');
        return;
      }

      const selectedItemIds = Object.keys(selectedItems.value).filter(id => selectedItems.value[id]);
      if (!selectedItemIds.length) {
        alert('Select at least one product');
        return;
      }

      const items = catalogItems.value.filter(item => selectedItemIds.includes(item.id));
      const totalAmount = items.reduce((sum, item) => {
        const amount = item.unitPrice?.amount;
        return Number.isFinite(amount) && amount >= 0 ? sum + amount : sum;
      }, 0);

      if (!Number.isFinite(totalAmount) || totalAmount < 0) {
        console.warn('[⚠️] TotalAmount inválido:', totalAmount);
        alert('Error calculating the total order amount.');
        return;
      }

      const totalItems = items.length;

      let supplier = ref({});

      const catalog = await catalogService.getCatalogById(catalogId);
      const supplierProfile = catalog.profileId;

      if (supplierProfile) {
        try {
          supplier.value = await profileService.getProfileById(supplierProfile);
          console.log('Provider profile loaded:', supplier.value);
        } catch (err) {
          console.error('Error loading provider profile:', err);
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
        alert('Order created successfully');
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

.purchase-order-container {
  padding: 2rem;
  max-width: 1000px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 4rem auto 0;
  font-size: 1.3rem;
  p {
    margin-bottom: 1rem;
    font-size: 2rem;
    color: #5A033A;
    font-weight: bold;
  }
  table {
    width: 100%;
    border: 2px solid #4E4E4E;
    margin-top: 2rem;
    text-align: center;
    thead {
      background-color: #6E0081;
      color: white;
    }
    th, td {
      padding: 1rem;
      border: 1px solid #4E4E4E;
    }
    th {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .check {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
  .create-btn {
    background-color: #5A033A;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 45px;
    font-size: 1.3rem;
    cursor: pointer;
    margin-top: 2rem;
    transition: background-color 0.3s ease;
  }
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
