<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProductService} from "@/inventory-management/services/product.service.js";
import userService from '@/authentication/services/user.service.js';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: 'ProductCreateAndEdit',
  components: {
    Button, InputText, InputNumber,
    SideNavbar, ToolbarContent
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productService = new ProductService();

    const product = ref({
      name: '',
      brandName: '',
      liquorType: '',
      imageUrl: '',
      unitPriceAmount: 0,
      minimumStock: 0,
      providerId: ''
    });

    const isEditMode = ref(false);
    const uploading = ref(false);

    const loadProduct = async () => {
      const { productId } = route.params;
      if (productId) {
        isEditMode.value = true;
        try {
          const data = await productService.getById(productId);
          product.value = {
            name: data.name,
            brandName: data.brandName,
            liquorType: data.liquorType,
            imageUrl: data.imageUrl,
            unitPriceAmount: data.unitPriceAmount,
            minimumStock: data.minimumStock,
            providerId: data.providerId
          };
        } catch (err) {
          console.error('Error loading product:', err);
        }
      }
    };

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploading.value = true;

      const cloudName = 'dshxmkd1v';
      const uploadPreset = 'unsigned_preset';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        product.value.imageUrl = data.secure_url;
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Image upload failed');
      } finally {
        uploading.value = false;
      }
    };

    const onSave = async () => {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        alert('No user found.');
        return;
      }

      try {
        if (isEditMode.value) {
          const updatedPayload = {
            id: route.params.productId,
            name: product.value.name,
            brandName: product.value.brandName,
            liquorType: product.value.liquorType,
            imageUrl: product.value.imageUrl,
            unitPriceAmount: product.value.unitPriceAmount,
            minimumStock: product.value.minimumStock,
            providerId: product.value.providerId,
            updatedUnitPriceAmount: product.value.unitPriceAmount,
            updatedMinimumStock: product.value.minimumStock,
            updatedImageUrl: product.value.imageUrl
          };

          await productService.update(route.params.productId, updatedPayload);
          alert('Product updated!');
        } else {
          await productService.create({
            ...product.value,
            providerId: currentUser.profileId
          });
          alert('Product created!');
        }

        router.push({ name: 'ProductList' });
      } catch (err) {
        console.error('Error saving product:', err);
        alert('Error saving product.');
      }
    };

    onMounted(loadProduct);

    return {
      product,
      isEditMode,
      onSave,
      uploading,
      uploadImage
    };
  }

};
</script>

<template>
  <SideNavbar>
    <ToolbarContent :pageTitle="isEditMode ? 'Edit Product' : 'New Product'" />
    <div class="product-form-container">
      <div class="p-fluid">
        <div class="field">
          <label>Name</label>
          <InputText v-model="product.name" />
        </div>
        <div class="field">
          <label>Brand</label>
          <InputText v-model="product.brandName" />
        </div>
        <div class="field">
          <label>Liquor Type</label>
          <InputText v-model="product.liquorType" />
        </div>
        <div class="field">
          <label>Upload Image</label>
          <input type="file" accept="image/*" @change="uploadImage" />
          <div v-if="uploading">Uploading...</div>
        </div>
        <div v-if="product.imageUrl" class="preview">
          <img :src="product.imageUrl" alt="Image preview" />
        </div>
        <div class="field">
          <label>Price (S/)</label>
          <InputNumber v-model="product.unitPriceAmount" mode="currency" currency="PEN" locale="es-PE" />
        </div>
        <div class="field">
          <label>Minimum Stock</label>
          <InputNumber v-model="product.minimumStock" :min="0" />
        </div>
        <div class="form-buttons">
          <Button label="Save" class="p-button-primary" @click="onSave" />
          <Button label="Back" class="p-button-secondary" @click="$router.push({ name: 'ProductList' })" />
        </div>
      </div>
    </div>
  </SideNavbar>
</template>

<style scoped>
.product-form-container {
  padding: 2rem;
}
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
