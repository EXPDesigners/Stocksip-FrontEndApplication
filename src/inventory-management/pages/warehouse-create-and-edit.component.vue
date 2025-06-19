<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import WarehouseList from "@/inventory-management/components/warehouse-list.component.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import {useRoute, useRouter} from "vue-router";
import {WarehouseService} from "@/inventory-management/services/warehouse.service.js";
import {onMounted, ref} from "vue";
import {Button as PvButton, Toast as PvToast} from "primevue";
import cloudinaryService from '@/shared/services/cloudinary.service.js';
import {useToast} from "primevue/usetoast";
import { useI18n } from 'vue-i18n';

export default {
  name: "warehouse-create-and-edit",
  components: {PvToast, PvButton, ToolbarContent, WarehouseList, SideNavbar},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const warehouseService = new WarehouseService();
    const { t } = useI18n();
    const toast = useToast();

    const isEditMode = ref(false);
    const id = ref(null);
    const submitted = ref(false);
    const selectedFile = ref(null);
    const existingImageUrl = ref(null);
    const newImagePreview = ref(null);
    const errors = ref({});

    const form = ref({
      name: '',
      location: '',
      city: '',
      state: '',
      postalCode: '',
      capacity: null,
      imageUrl: null
    });

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.name.trim()) {
        errors.value.name = 'Name is required';
        isValid = false;
      }

      if (!form.value.location.trim()) {
        errors.value.location = 'Location is required';
        isValid = false;
      }

      if (!form.value.city.trim()) {
        errors.value.city = 'City is required';
        isValid = false;
      }

      if (!form.value.state.trim()) {
        errors.value.state = 'State is required';
        isValid = false;
      }

      if (!form.value.postalCode) {
        errors.value.postalCode = 'Postal code is required';
        isValid = false;
      } else if (!/^\d{5}$/.test(form.value.postalCode)) {
        errors.value.postalCode = 'Enter a valid 5-digit postal code';
        isValid = false;
      }

      if (form.value.capacity === null || form.value.capacity === '') {
        errors.value.capacity = 'Capacity is required';
        isValid = false;
      } else if (Number(form.value.capacity) < 1) {
        errors.value.capacity = 'Must be greater than 0';
        isValid = false;
      }

      return isValid;
    };

    const loadWarehouseData = async () => {
      try {

        const warehouse = await warehouseService.getWarehouseById(id.value);

        form.value = {
          name: warehouse.name,
          location: warehouse.location,
          city: warehouse.city,
          state: warehouse.state,
          postalCode: warehouse.postalCode,
          capacity: warehouse.capacity,
          imageUrl: warehouse.imageUrl
        };

        existingImageUrl.value = warehouse.imageUrl || null;

      } catch (error) {
        setTimeout(() => router.push('/warehouses'), 2000);
      }
    };

    const showExistingImage = () => {
      if (existingImageUrl.value) {
        return existingImageUrl.value;
      }
      return null;
    };

    onMounted(() => {
      id.value = route.params.id;
      isEditMode.value = Boolean(id.value);

      if (isEditMode.value) {
        loadWarehouseData();
      }
    });

    const onSubmit = async () => {
      submitted.value = true;

      if (!validateForm()) {
        submitted.value = false;
        return;
      }

      try {
        const warehouseData = {
          name: form.value.name,
          location: form.value.location,
          city: form.value.city,
          state: form.value.state,
          postalCode: form.value.postalCode,
          capacity: Number(form.value.capacity),
          imageUrl: form.value.imageUrl || ''
        };

        if (selectedFile.value) {
          const uploadResult = await cloudinaryService.uploadImage(selectedFile.value);
          warehouseData.imageUrl = uploadResult.secure_url;
        }

        let response;

        if (isEditMode.value) {
          response = await warehouseService.updateWarehouse(id.value, warehouseData);
          toast.add({ severity: 'success', summary: t('toast.success'), detail: t('warehouses.update_success'), life: 3000 })
        } else {
          response = await warehouseService.createWarehouse(warehouseData);
          toast.add({ severity: 'success', summary: t('toast.success'), detail: t('warehouses.create_success'), life: 3000 });
        }

        await router.push('/warehouses');
      } finally {
        submitted.value = false;
      }
    };

    const onFileSelect = (event) => {
      selectedFile.value = event.files[0];
      if (selectedFile.value) {
        newImagePreview.value = URL.createObjectURL(selectedFile.value);
      }
    };

    const onCancel = () => {
      router.push('/warehouses');
    };

    return {
      form,
      errors,
      submitted,
      isEditMode,
      existingImageUrl,
      newImagePreview,
      onFileSelect,
      onSubmit,
      onCancel
    };
  }
}
</script>

<template>
  <div class="warehouse-bg">
    <side-navbar />
    <div class="warehouse-main">
      <toolbar-content :pageTitle="isEditMode ? 'Edit Warehouse' : 'Create Warehouse'" />
      <div class="warehouse-content">
        <pv-card class="form-container">
          <template #content>
            <form @submit.prevent="onSubmit">
              <div class="p-fluid grid">

                <div class="field col-12 md:col-6">
                  <label for="name">{{ $t('warehouses.name') }}</label>
                  <pv-input-text
                      id="name"
                      v-model="form.name"
                      placeholder="Principal Warehouse"
                      :class="{ 'p-invalid': submitted && errors.name }"
                  />
                  <small v-if="submitted && errors.name" class="p-error">
                    {{ errors.name }}
                  </small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="location">{{ $t('warehouses.address') }}</label>
                  <pv-input-text
                      id="location"
                      v-model="form.location"
                      placeholder="Av. Sol"
                      :class="{ 'p-invalid': submitted && errors.location }"
                  />
                  <small v-if="submitted && errors.location" class="p-error">
                    {{ errors.location }}
                  </small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="city">{{ $t('warehouses.city') }}</label>
                  <pv-input-text
                      id="city"
                      v-model="form.city"
                      placeholder="Lima"
                      :class="{ 'p-invalid': submitted && errors.city }"
                  />
                  <small v-if="submitted && errors.city" class="p-error">
                    {{ errors.city }}
                  </small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="state">{{ $t('warehouses.state') }}</label>
                  <pv-input-text
                      id="state"
                      v-model="form.state"
                      placeholder="Cusco"
                      :class="{ 'p-invalid': submitted && errors.state }"
                  />
                  <small v-if="submitted && errors.state" class="p-error">
                    {{ errors.state }}
                  </small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="postalCode">{{ $t('warehouses.postal-code') }}</label>
                  <pv-input-text
                      id="postalCode"
                      v-model="form.postalCode"
                      placeholder="08000"
                      :class="{ 'p-invalid': submitted && errors.postalCode }"
                  />
                  <small v-if="submitted && errors.postalCode" class="p-error">
                    {{ errors.postalCode }}
                  </small>
                </div>

                <div class="field col-12 md:col-6">
                  <label for="capacity">{{ $t('warehouses.capacity') }} (m²)</label>
                  <pv-input-number
                      id="capacity"
                      v-model="form.capacity"
                      placeholder="1000"
                      :class="{ 'p-invalid': submitted && errors.capacity }"
                      :min="1"
                  />
                  <small v-if="submitted && errors.capacity" class="p-error">
                    {{ errors.capacity }}
                  </small>
                </div>

                <div class="field col-12 image-upload-section">
                  <h3>{{ $t('components.upload-image') }}</h3>
                  <pv-file-upload
                      mode="basic"
                      name="warehouseImage"
                      accept="image/*"
                      :maxFileSize="1000000"
                      :chooseLabel="$t('components.upload-file')"

                      @select="onFileSelect"
                  >
                  </pv-file-upload>
                  <div v-if="newImagePreview" class="new-image-preview">
                    <p>New Image Preview:</p>
                    <img :src="newImagePreview" alt="New Image Preview" style="max-width: 200px; margin-top: 10px;"/>
                  </div>


                  <div v-if="isEditMode && existingImageUrl && !newImagePreview" class="existing-image-preview">
                    <p>Current Image:</p>
                    <img :src="existingImageUrl" alt="Current Warehouse Image" style="max-width: 200px; margin-top: 10px;"/>
                    <p class="image-change-note">Select a new file to change the image</p>
                  </div>
                </div>

                <div class="field col-12 form-actions">
                  <pv-button
                      :label="$t('components.cancel')"
                      icon="pi pi-times"
                      class="cancel-button"
                      @click="onCancel"
                  />
                  <pv-button
                      :label="isEditMode ? $t('components.update') : $t('components.save')"
                      icon="pi pi-check"
                      type="submit"
                      class="create-update-button"
                      :disabled="submitted && Object.keys(errors).length > 0"
                  />
                </div>
              </div>
            </form>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #F7EDDC;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.image-upload-section {
  margin: 1.5rem 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.field {
  margin-bottom: 1.5rem;
}

.upload-image-button  {
  background-color: #59033A !important;
  color: white;
  border: none;
}

.upload-image-button:hover {
  background-color: #7a044d !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

.create-update-button {
  background-color: #59033A;
  color: white;
  border: none;
}

.create-update-button:hover {
  background-color: #7a044d !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  color: white !important;
  filter: brightness(1.1);
  box-shadow: 0 3px 5px rgba(89, 3, 58, 0.3);
}

.cancel-button {
  background-color: #790b38;
  color: white;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #7a044d !important;
  border-color: #46062c !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 5px rgba(121, 11, 56, 0.3);
  color: white !important;
  filter: brightness(1.1);
}
.existing-image-preview {
  margin-top: 15px;
  padding: 10px;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.image-change-note {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}


</style>