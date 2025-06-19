<template>
  <SideNavbar>
    <ToolbarContent :pageTitle="isEditMode ? 'Edit Catalog' : 'New Catalog'" />
    <div class="catalog-row">
      <div class="catalog-form">
        <div class="p-fluid">
          <div class="field">
            <label for="catalogName">Catalog Name</label>
            <InputText id="catalogName" class="Input" v-model="catalog.name" required />
          </div>

          <h3>Add New Product</h3>

          <div class="field">
            <label>Name</label>
            <InputText class="Input" v-model="newProduct.name" />
          </div>
          <div class="field">
            <label>Type</label>
            <InputText class="Input" v-model="newProduct.productType" />
          </div>
          <div class="field">
            <label>Brand</label>
            <InputText class="Input" v-model="newProduct.brand" />
          </div>
          <div class="field">
            <label>Content (ml)</label>
            <pv-input-number class="InputNumber" v-model="newProduct.content" :min="0" />
          </div>
          <div class="field">
            <label>Price (S/)</label>
            <pv-input-number class="InputNumber" v-model="newProduct.price" mode="currency" currency="PEN" locale="es-PE" :min="0" />
          </div>

          <div class="buttons">
            <Button label="Save" @click="onSave" class="p-button-primary" />
            <Button label="Reset" @click="resetForm" class="p-button-secondary" />
          </div>

          <div v-if="showError" class="error">Please, complete all the labels.</div>
        </div>
      </div>
    </div>
  </SideNavbar>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';

import { CatalogService } from '@/order-operation-and-monitoring/services/catalog.service';
import userService from '@/authentication/services/user.service';
import { Money } from '@/shared/model/money';
import { Currency } from '@/shared/model/currency';

import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: 'CatalogCreateAndEdit',
  components: {
    ToolbarContent,
    SideNavbar,
    Card, Button, InputText, InputNumber, DataTable, Column
  },
  setup() {
    const route = useRoute();
    const catalogService = new CatalogService();

    const catalogItems = ref([]);
    const isEditMode = ref(false);
    const showError = ref(false);

    const catalog = ref({
      id: 0,
      name: '',
      profileId: 0,
      dateCreated: '',
      isPublished: false
    });

    const newProduct = ref({
      name: '',
      productType: '',
      content: 0,
      brand: '',
      price: null
    });

    const loadCatalogItems = async () => {
      try {
        const items = await catalogService.getCatalogItems(catalog.value.id);
        catalogItems.value = items.map(item => {
          const raw = item.unitPrice || {};
          const amount = raw._amount ?? raw.amount ?? 0;
          const currency = raw._currency?._code ?? raw.currency ?? 'PEN';
          return {
            ...item,
            unitPrice: new Money({ amount, currency: new Currency(currency) })
          };
        });
      } catch (err) {
        console.error('Error loading catalog items:', err);
      }
    };

    const loadCatalog = async () => {
      const id = Number(route.params.catalogId || 0);
      if (id > 0) {
        isEditMode.value = true;
        try {
          catalog.value = await catalogService.getCatalogById(id);
          await loadCatalogItems();
        } catch (err) {
          console.error('Error loading catalog:', err);
        }
      }
    };

    const onSave = async () => {
      if (!catalog.value.name.trim()) {
        showError.value = true;
        return;
      }

      showError.value = false;

      const currentProfile = userService.getCurrentUserProfile();
      if (!currentProfile) {
        console.error('Could not get the current profile');
        showError.value = true;
        return;
      }

      const payload = {
        ...catalog.value,
        name: catalog.value.name.trim(),
        profileId: currentProfile.profileId,
        dateCreated: new Date().toISOString(),
        isPublished: false
      };

      try {
        if (isEditMode.value) {
          await catalogService.updateCatalog(payload);
          await handleCatalogSaveSuccess();
        } else {
          catalog.value = await catalogService.createCatalog(payload);
          isEditMode.value = true;
          await handleCatalogSaveSuccess();
        }
      } catch (err) {
        console.error('Error saving catalog:', err);
      }
    };

    const handleCatalogSaveSuccess = async () => {
      const values = Object.values(newProduct.value);
      const filled = values.some(v => v !== '' && v !== null && v !== 0);

      if (filled) {
        const valid = values.every(v => v !== '' && v !== null && v !== 0);
        if (!valid) {
          showError.value = true;
          return;
        }

        const newItem = {
          id: uuidv4(),
          catalogId: catalog.value.id,
          dateAdded: new Date().toISOString(),
          name: newProduct.value.name,
          productType: newProduct.value.productType,
          brand: newProduct.value.brand,
          content: +newProduct.value.content,
          unitPrice: new Money({ amount: +newProduct.value.price, currency: new Currency('PEN') })
        };

        try {
          await catalogService.addCatalogItem(newItem);
          catalogItems.value.push(newItem);
          resetForm();
          alert(isEditMode.value ? 'Catalog updated and product added' : 'Catalog created and product added');
        } catch (err) {
          console.error('Error adding product:', err);
        }
      } else {
        alert(isEditMode.value ? 'Catalog updated correctly' : 'Catalog created successfully');
      }
    };

    const resetForm = () => {
      newProduct.value = {
        name: '',
        productType: '',
        content: 0,
        brand: '',
        price: null
      };
    };

    const formatPrice = (price) => price?.format?.('es-PE') ?? 'S/0.00';

    onMounted(() => {
      loadCatalog();
    });

    return {
      catalog,
      catalogItems,
      isEditMode,
      newProduct,
      showError,
      onSave,
      resetForm,
      formatPrice
    };
  }
};
</script>


<style scoped>
.catalog-row {
  gap: 2rem;
  padding: 2rem;
}

.catalog-form {
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}

.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
}


.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #5A033A;
  }
  .Input {
    width: 100%;
    padding: 0.5rem;
    border: 3px solid #26021C;
    border-radius: 15px;
    font-size: 1rem;
    background-color: white;
    color: black;
  }
  .Input:focus {
    border-color: #6E0081;
    outline: none;
  }
  .InputNumber {
    width: 100%;
    padding: 0.5rem;
    border: 3px solid #26021C;
    border-radius: 15px;
    font-size: 1rem;
    background-color: white;
    color: black;
    ::v-deep(.p-inputtext) {
      padding: 0.5rem;
      border: 3px solid #26021C;
      border-radius: 15px;
      font-size: 1rem;
      background-color: white !important;
      color: black !important;
    }
    ::v-deep(.p-inputnumber) {
      border: none;
    }
  }
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  .p-button-primary {
    background-color: #5A033A;
    color: white;
    border-radius: 45px;
    border: none;
    padding: 0.5rem 1.5rem;
  }
  .p-button-secondary {
    background-color: white;
    color: #5A033A;
    border-radius: 45px;
    border: #5A033A 3px solid;
    padding: 0.5rem 1.5rem;
  }
  .p-button-secondary:hover {
    background-color: #6E0081;
    border-color: #6E0081;
    color: white;
  }
  .p-button-primary:hover {
    background-color: #6E0081;
    border-color: #6E0081;
    color: white;
  }
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
