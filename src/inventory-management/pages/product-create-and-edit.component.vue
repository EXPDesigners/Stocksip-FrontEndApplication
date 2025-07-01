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
import {InputNumber as PvInputNumber, InputText as PvInputText} from "primevue";

export default {
  name: 'ProductCreateAndEdit',
  components: {
    PvInputNumber,
    PvInputText,
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
  <div class="product-bg">
    <side-navbar />
    <div class="product-main">
      <toolbar-content :pageTitle="isEditMode ? $t('products.edit-title') : $t('products.new-title')" />
      <div class="product-content">
        <div class="form-card">
          <h2 class="form-title">{{ isEditMode ? 'Edit Product Data' : 'Enter Product Data' }}</h2>
          <div class="form-grid">

            <div class="form-group">
              <label>{{ $t('products.name') }} <span class="important">*</span></label>
              <pv-input-text v-model="product.name" class="form-input" placeholder="Ron Cartavio" />
            </div>

            <div class="form-group">
              <label>{{ $t('products.brand') }} <span class="important">*</span></label>
              <pv-input-text v-model="product.brandName" class="form-input" placeholder="Cartavio" />
            </div>

            <div class="form-group">
              <label>{{ $t('products.liquor-type') }}<span class="important">*</span></label>
              <pv-input-text v-model="product.liquorType" class="form-input" placeholder="Ron" />
            </div>

            <div class="form-group">
              <label>{{ $t('products.price') }} (S/)<span class="important">*</span></label>
              <pv-input-number v-model="product.unitPriceAmount" mode="currency" currency="PEN" locale="es-PE"/>
            </div>

            <div class="form-group">
              <label>{{ $t('products.minimum-stock') }}<span class="important">*</span></label>
              <pv-input-number v-model="product.minimumStock" :min="0"/>
            </div>

            <div class="form-group full-width image-section">
              <label>Product Image</label>
              <div class="image-upload-container">
                <label for="file-upload" class="upload-button">
                  <span>+ Upload File</span>
                  <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      @change="uploadImage"
                      style="display: none;"
                  >
                </label>
                <span class="file-name">{{ uploading ? 'Uploading...' : (product.imageUrl ? 'File selected' : 'No file chosen') }}</span>
              </div>

              <div v-if="product.imageUrl" class="image-preview">
                <p>Preview:</p>
                <img :src="product.imageUrl" alt="Preview" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <div class="right-actions">
              <Button label="Back" class="cancel-button" @click="$router.push({ name: 'ProductList' })" />
              <Button label="Save" class="submit-button" @click="onSave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-bg {
  background: #F7EDDC;
  min-height: 100vh;
  display: flex;
}

.product-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-content {
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-title {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #59033A;
}

.p-inputnumber {
  width: 100%;
}

.p-inputnumber input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.image-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.image-upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.upload-button {
  background-color: #59033A;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #7a044d;
}

.file-name {
  color: #666;
  font-size: 0.9rem;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  border: 1px solid #eee;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.right-actions {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #59033A;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #7a044d;
}

.important {
  color: #ea1c18;
}
</style>

