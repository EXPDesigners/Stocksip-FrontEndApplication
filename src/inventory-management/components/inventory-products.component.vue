<script>
import { FilterMatchMode } from '@primevue/core/api';
import { useRoute } from 'vue-router';
import { InventoryService } from "@/inventory-management/services/inventory.service.js";

const inventoryService = new InventoryService();

export default {
  name: 'inventory-products',
  data() {
    return {
      products: [],
      productDialog: false,
      stockDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: 'WithStock', value: 'WithStock' },
        { label: 'OutOfStock', value: 'OutOfStock' }
      ],
      warehouseId: null,
      stockOperation: 'add',
      stockData: {
        quantity: 1,
        expirationDate: null
      }
    };
  },
  created() {
    this.initFilters();
    const route = useRoute();
    this.warehouseId = route.params.warehouseId;
  },
  async mounted() {
    if (this.warehouseId) {
      await this.refreshProducts();
    }
  },
  methods: {
    async refreshProducts() {
      this.products = await inventoryService.getAllProductsByWarehouseId(this.warehouseId);
    },
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
    openStockDialog(product, operation = 'add') {
      this.product = { ...product };
      this.stockOperation = operation;

      this.stockData = {
        quantity: 1,
        expirationDate: product.bestBeforeDate
            ? new Date(product.bestBeforeDate + 'T12:00:00')
            : new Date()
      };

      this.stockDialog = true;
    },
    async handleStockOperation() {
      try {
        if (!this.stockData.expirationDate) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('toast.error'),
            detail:  this.$t('inventory.valid-date'),
            life: 5000
          });
          return;
        }

        if (this.stockOperation === 'subtract' && this.stockData.quantity > this.product.currentStock) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('toast.error'),
            detail: this.$t('inventory.stock-reduced-error'),
            life: 5000
          });
          return;
        }

        const formattedDate = new Date(this.stockData.expirationDate).toISOString().split('T')[0];

        if (this.stockOperation === 'add') {
          await inventoryService.addStock(
              this.product.productId,
              this.warehouseId,
              this.stockData.quantity,
              formattedDate
          );
        } else {
          await inventoryService.subtractStock(
              this.product.productId,
              this.warehouseId,
              this.stockData.quantity,
              formattedDate
          );
        }

        this.$toast.add({
          severity: 'success',
          summary: this.$t('toast.success'),
          detail: this.stockOperation === 'add'
              ? this.$t('inventory.stock-added')
              : this.$t('inventory.stock-reduced'),
          life: 3000
        });

        await this.refreshProducts();
        this.stockDialog = false;
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || 'Error al procesar la operación',
          life: 5000
        });
      }
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
        case 'WithStock': return 'success';
        case 'OutOfStock': return 'danger';
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
            <pv-button :label="$t('components.add')" icon="pi pi-plus" class="mr-2" @click="openNew" />
            <pv-button :label="$t('components.delete')" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
          </template>
          <template #end>
            <pv-button :label="$t('components.export')" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)"/>
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
              <h4 class="m-4 inventory-title">{{ $t('inventory.manage-products') }}</h4>
              <div class="ml-auto">
                <pv-icon-field>
                  <pv-input-icon>
                    <i class="pi pi-search" />
                  </pv-input-icon>
                  <pv-input-text v-model="filters['global'].value" :placeholder="$t('components.search')" />
                </pv-icon-field>
              </div>
            </div>
          </template>

          <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false" />
          <pv-column field="name" :header="$t('inventory.name')" sortable style="min-width: 8rem" />
          <pv-column field="type" :header="$t('inventory.liquor-type')" sortable style="min-width: 8rem" />
          <pv-column field="imageUrl" :header="$t('inventory.image')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" alt="Product" class="rounded" style="width: 64px" />
            </template>
          </pv-column>
          <pv-column field="unitPriceAmount" :header="$t('inventory.unit-price')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.unitPriceAmount) }}
            </template>
          </pv-column>
          <pv-column field="minimumStock" :header="$t('inventory.minimum-stock')" sortable style="min-width: 10rem" />
          <pv-column field="currentStock" :header="$t('inventory.current-stock')" sortable style="min-width: 8rem" />
          <pv-column field="status" :header="$t('inventory.state')" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <pv-tag :value="$t(`inventory.status.${slotProps.data.status}`)" :severity="getStatusLabel(slotProps.data.status)"/>
            </template>
          </pv-column>
          <pv-column field="bestBeforeDate" :header="$t('inventory.best-date-before')" sortable style="min-width: 8rem"/>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button icon="pi pi-plus" outlined rounded class="mr-2"
                         @click="openStockDialog(slotProps.data, 'add')" />
              <pv-button icon="pi pi-minus" outlined rounded severity="warning" class="mr-2"
                         @click="openStockDialog(slotProps.data, 'subtract')" />
              <pv-button icon="pi pi-trash" outlined rounded severity="danger"
                         @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <pv-dialog v-model:visible="stockDialog" :style="{ width: '500px' }"
                 :header="stockOperation === 'add' ? $t('inventory.stock-added-title') : $t('inventory.stock-reduced-title')"
                 :modal="true">
        <div class="edit-dialog">
          <div class="image-container">
            <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-image"/>
          </div>

          <div class="form-grid">
            <div class="col-span-2">
              <label class="block font-bold mb-2">{{ $t('inventory.product-id') }}</label>
              <pv-tag :value="product.productId" class="w-full" />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.name') }}</label>
              <pv-input-text :modelValue="product.name" disabled />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.liquor-type') }}</label>
              <pv-input-text :modelValue="product.type" disabled />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.unit-price') }}</label>
              <pv-input-number
                  :modelValue="product.unitPriceAmount"
                  disabled
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
              />
            </div>

            <div>
              <label class="block font-bold mb-2">{{ $t('inventory.current-stock') }}</label>
              <pv-input-number :modelValue="product.currentStock" disabled />
            </div>
            <div class="combined-row">
              <div class="quantity-field">
                <label class="block font-bold mb-2">
                  {{ stockOperation === 'add' ? $t('inventory.quantity-add') : $t('inventory.quantity-reduce') }}
                </label>
                <pv-input-number
                    v-model="stockData.quantity"
                    :min="1"
                    :max="stockOperation === 'subtract' ? product.currentStock : null"
                    showButtons
                    :step="1"
                    mode="decimal"
                    :disabled="stockOperation === 'subtract' && product.currentStock <= 0"
                />
              </div>

              <div class="date-field">
                <label class="block font-bold mb-2">
                  {{ stockOperation === 'add' ? $t('inventory.best-date-before') : $t('inventory.best-date-before') }}
                </label>
                <pv-date-picker
                    v-model="stockData.expirationDate"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :minDate="stockOperation === 'add' ? new Date() : null"
                    :showButtonBar="true"
                    inputId="expiration-date"
                />
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <pv-button :label="$t('components.cancel')" icon="pi pi-times" @click="stockDialog = false" class="p-button-text cancel-btn" />
            <pv-button
                :label="stockOperation === 'add' ? $t('components.save') : $t('components.save')"
                icon="pi pi-check"
                @click="handleStockOperation"
                :class="{
            'p-button-success': stockOperation === 'add',
            'p-button-warning': stockOperation === 'subtract'
          }"
                class="action-btn"
            />
          </div>
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

.inventory-title {
  font-size: 1.5rem;
}

.edit-dialog {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.product-image {
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
  border-radius: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-grid .col-span-2 {
  grid-column: span 2;
}

.combined-row {
  grid-column: span 2;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.quantity-field {
  flex: 1;
}

.date-field {
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
}

</style>