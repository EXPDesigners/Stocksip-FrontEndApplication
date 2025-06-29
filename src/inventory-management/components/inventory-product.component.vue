<script>

import { FilterMatchMode } from '@primevue/core/api';
import { WarehouseService } from '@/inventory-management/services/warehouse.service.js';
import { useRoute } from 'vue-router';

const warehouseService = new WarehouseService();

export default {
  name: 'inventory-product',
  data() {
    return {
      products: [],
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: 'INSTOCK', value: 'INSTOCK' },
        { label: 'LOWSTOCK', value: 'LOWSTOCK' },
        { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
      ],
      warehouseId: null
    };
  },
  created() {
    this.initFilters();
    const route = useRoute();
    this.warehouseId = route.params.warehouseId;
  },
  async mounted() {
    if (this.warehouseId) {
      this.products = await warehouseService.getAllProductsByWarehouseId(this.warehouseId);
    }
  },
  methods: {
    formatCurrency(value) {
      return value ? value.toLocaleString('es-Pe', { style: 'currency', currency: 'PEN' }) : '';
    },
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
    },
    saveProduct() {
      this.submitted = true;
      if (this.product?.name?.trim()) {
        if (this.product.id) {
          this.products[this.findIndexById(this.product.id)] = this.product;
          this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
          this.product.id = Math.random().toString(36).substring(2, 9);
          this.product.imageUrl = 'product-placeholder.svg';
          this.product.inventoryStatus = this.product.inventoryStatus || 'INSTOCK';
          this.products.push(this.product);
          this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        this.productDialog = false;
        this.product = {};
      }
    },
    editProduct(product) {
      this.product = { ...product };
      this.productDialog = true;
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    deleteProduct() {
      this.products = this.products.filter(p => p.id !== this.product.id);
      this.deleteProductDialog = false;
      this.product = {};
      this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    },
    findIndexById(id) {
      return this.products.findIndex(p => p.id === id);
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteProductsDialog = true;
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(p => !this.selectedProducts.includes(p));
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      };
    },
    getStatusLabel(status) {
      switch (status) {
        case 'INSTOCK': return 'success';
        case 'LOWSTOCK': return 'warn';
        case 'OUTOFSTOCK': return 'danger';
        default: return null;
      }
    }
  }
};
</script>

<template>
  <div class="inventory-container">
    <div>
      <div class="card">
        <pv-toolbar class="mb-6">
          <template #start>
            <pv-button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <pv-button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
          </template>
          <template #end>
            <pv-button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
          </template>
        </pv-toolbar>

        <pv-data-table
            ref="dt"
            v-model:selection="selectedProducts"
            :value="products"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
          <template #header>
            <div class="flex items-center w-full">
              <h4 class="m-0">Manage Products</h4>
              <div class="ml-auto">
                <pv-icon-field>
                  <pv-input-icon>
                    <i class="pi pi-search" />
                  </pv-input-icon>
                  <pv-input-text v-model="filters['global'].value" placeholder="Search..." />
                </pv-icon-field>
              </div>
            </div>
          </template>

          <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false" />
          <pv-column field="name" header="Name" sortable style="min-width: 16rem" />
          <pv-column field="brandName" header="Brand" sortable style="min-width: 12rem" />
          <pv-column field="liquorType" header="Type" sortable style="min-width: 12rem" />
          <pv-column field="unitPriceAmount" header="Price" sortable style="min-width: 8rem">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.unitPriceAmount) }}
            </template>
          </pv-column>
          <pv-column field="minimumStock" header="Min Stock" sortable style="min-width: 10rem" />
          <pv-column field="providerId" header="Provider" sortable style="min-width: 12rem" />
          <pv-column field="imageUrl" header="Image">
            <template #body="slotProps">
              <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" alt="Product" class="rounded" style="width: 64px" />
            </template>
          </pv-column>
          <pv-column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
              <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
              <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <pv-dialog v-model:visible="productDialog" :style="{ width: '500px' }" header="Product Details" :modal="true">
        <div class="flex flex-col gap-6">
          <div>
            <label for="name" class="block font-bold mb-2">Name</label>
            <pv-input-text id="name" v-model.trim="product.name" required autofocus :invalid="submitted && !product.name" />
            <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
          </div>

          <div>
            <label for="brandName" class="block font-bold mb-2">Brand</label>
            <pv-input-text id="brandName" v-model="product.brandName" />
          </div>

          <div>
            <label for="liquorType" class="block font-bold mb-2">Liquor Type</label>
            <pv-input-text id="liquorType" v-model="product.liquorType" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="unitPriceAmount" class="block font-bold mb-2">Unit Price</label>
              <pv-input-number
                  id="unitPriceAmount"
                  v-model="product.unitPriceAmount"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  currencyDisplay="symbol"
              />
            </div>

            <div>
              <label for="minimumStock" class="block font-bold mb-2">Min Stock</label>
              <pv-input-number id="minimumStock" v-model="product.minimumStock" />
            </div>
          </div>

          <div>
            <label for="providerId" class="block font-bold mb-2">Provider ID</label>
            <pv-input-text id="providerId" v-model="product.providerId" />
          </div>

          <div>
            <label for="imageUrl" class="block font-bold mb-2">Image URL</label>
            <pv-input-text id="imageUrl" v-model="product.imageUrl" />
          </div>

          <img v-if="product.imageUrl" :src="product.imageUrl" alt="Product" class="mx-auto rounded mt-4" style="max-width: 150px" />
        </div>

        <template #footer>
          <pv-button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
          <pv-button label="Save" icon="pi pi-check" @click="saveProduct" />
        </template>
      </pv-dialog>

      <pv-dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
        </div>
        <template #footer>
          <pv-button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
          <pv-button label="Yes" icon="pi pi-check" @click="deleteProduct" />
        </template>
      </pv-dialog>

      <pv-dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle !text-3xl" />
          <span>Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
          <pv-button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
          <pv-button label="Yes" icon="pi pi-check" @click="deleteSelectedProducts" />
        </template>
      </pv-dialog>
    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  max-width: 2200px;
  margin: 2rem 1rem;
  padding: 1rem 2rem;
}
</style>