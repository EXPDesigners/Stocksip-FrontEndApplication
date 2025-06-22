<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";
import {useRoute, useRouter} from "vue-router";
import {WarehouseService} from "@/inventory-management/services/warehouse.service.js";
import {onMounted, ref} from "vue";
import {InputText as PvField, InputText as PvInputText, Message as PvMessage} from "primevue";
import cloudinaryService from '@/shared/services/cloudinary.service.js';
import {useToast} from "primevue/usetoast";
import { useI18n } from 'vue-i18n';

export default {
  name: "warehouse-create-and-edit",
  components: {PvMessage, ToolbarContent, SideNavbar, PvInputText, PvField},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const warehouseService = new WarehouseService();
    const {t} = useI18n();
    const toast = useToast();

    const isEditMode = ref(false);
    const warehouseId = ref(null);
    const submitted = ref(false);
    const selectedFile = ref(null);
    const existingImageUrl = ref(null);
    const newImagePreview = ref(null);
    const errors = ref({});

    const initialValues = ref({
      name: '',
      street: '',
      city: '',
      district: '',
      postalCode: '',
      country: '',
      maxTemperature: null,
      minTemperature: null,
      capacity: null,
      imageUrl: ''
    });

    const form = ref({...initialValues.value});


    const resolver = ({ values }) => {
      const errors = {};

      if (!values.name?.trim()) {
        errors.name = [{ message: t('errors.name-required') }];
      }

      if (!values.street?.trim()) {
        errors.street = [{ message: t('errors.street-required') }];
      }

      if (!values.city?.trim()) {
        errors.city = [{ message: t('errors.city-required') }];
      }

      if (!values.district?.trim()) {
        errors.district = [{ message: t('errors.district-required') }];
      }

      if (!values.postalCode?.trim()) {
        errors.postalCode = [{ message: t('errors.postal-code-required') }];
      }

      if (!values.country?.trim()) {
        errors.country = [{ message: t('errors.country-required') }];
      }

      if (values.maxTemperature === null || isNaN(values.maxTemperature) || values.maxTemperature > 50 || values.maxTemperature < -50) {
        errors.maxTemperature = [{ message: t('errors.max-temperature-required') }];
      }

      if (values.minTemperature === null || isNaN(values.minTemperature) || values.minTemperature > 50 || values.minTemperature < -50) {
        errors.minTemperature = [{ message: t('errors.min-temperature-required') }];
      }

      if (values.capacity === null || isNaN(values.capacity) || values.capacity < 0) {
        errors.capacity = [{ message: t('errors.capacity-required') }];
      }

      return { values, errors };
    };

    const loadWarehouseData = async () => {
      try {

        const warehouse = await warehouseService.getWarehouseById(warehouseId.value);

        form.value = {
          name: warehouse.name,
          street: warehouse.street,
          city: warehouse.city,
          district: warehouse.district,
          postalCode: warehouse.postalCode,
          country: warehouse.country,
          maxTemperature: warehouse.maxTemperature,
          minTemperature: warehouse.minTemperature,
          capacity: warehouse.capacity,
          imageUrl: warehouse.imageUrl,
          profileId: '128127128'
        };

        existingImageUrl.value = warehouse.imageUrl || null;

      } catch (error) {
        setTimeout(() => router.push('/warehouses'), 2000);
      }
    };

    onMounted(() => {
      warehouseId.value = route.params.warehouseId;
      isEditMode.value = Boolean(warehouseId.value);

      if (isEditMode.value) {
        loadWarehouseData();
      }
    });

    const onSubmit = async () => {
      submitted.value = true;

      const warehouseData = {
        name: form.value.name,
        street: form.value.street,
        city: form.value.city,
        district: form.value.district,
        postalCode: form.value.postalCode,
        country: form.value.country,
        maxTemperature: Number(form.value.maxTemperature),
        minTemperature: Number(form.value.minTemperature),
        capacity: Number(form.value.capacity),
        imageUrl: form.value.imageUrl || '',
        profileId: '128127128'
      };

      console.log("Warehouse:", warehouseData);

      if (selectedFile.value) {
        const uploadResult = await cloudinaryService.uploadImage(selectedFile.value);
        warehouseData.imageUrl = uploadResult.secure_url;
      }

      if (isEditMode.value) {
        await warehouseService.updateWarehouse(warehouseId.value, warehouseData);
        toast.add({
          severity: 'success',
          summary: t('toast.success'),
          detail: t('warehouses.update_success'),
          life: 3000
        });
      } else {
        await warehouseService.createWarehouse(warehouseData);
        toast.add({
          severity: 'success',
          summary: t('toast.success'),
          detail: t('warehouses.create_success'),
          life: 3000
        });
      }

      await router.push('/warehouses');
      submitted.value = false;
    };

    const onFileSelect = (event) => {
      const file = event.target?.files?.[0];
      if (!file) return;

      selectedFile.value = file;
      newImagePreview.value = URL.createObjectURL(file);
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
      selectedFile,
      initialValues,
      resolver,
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
      <toolbar-content :pageTitle="isEditMode ? $t('warehouses.editWarehouseTitle') : $t('warehouses.createWarehouseTitle')" />
      <div class="warehouse-content">
        <pv-form :initialValues="initialValues" :resolver="resolver" @submit="onSubmit" v-slot="$form" class="form-card">
          <h2 class="form-title">{{ isEditMode ? $t('components.edit-data') : $t('components.complete-data') }}</h2>
          <div class="form-grid">

            <div class="form-group">
              <label>{{$t('warehouses.form.name')}} <span class="important">*</span></label>
              <pv-input-text
                  name="name"
                  v-model="form.name"
                  placeholder="Principal Warehouse"
                  class="form-input"
                  :class="{ 'input-error': errors.name }"
              />
              <pv-message v-if="$form.name?.invalid" class="form-error">{{ $form.name.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="street">{{$t('warehouses.form.street')}} <span class="important">*</span></label>
              <pv-input-text
                  name="street"
                  v-model="form.street"
                  type="text"
                  placeholder="Av. Sol"
                  class="form-input"
              />
              <pv-message v-if="$form.street?.invalid" class="form-error">{{ $form.street.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="city">{{$t('warehouses.form.city')}} <span class="important">*</span></label>
              <pv-input-text
                  name="city"
                  v-model="form.city"
                  type="text"
                  placeholder="Lima"
                  class="form-input"
              />
              <pv-message v-if="$form.city?.invalid" class="form-error">{{ $form.city.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="district">{{$t('warehouses.form.district')}} <span class="important">*</span></label>
              <pv-input-text
                  name="district"
                  v-model="form.district"
                  type="text"
                  placeholder="Lima"
                  class="form-input"
              />
              <pv-message v-if="$form.district?.invalid" class="form-error">{{ $form.district.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="postalCode">{{$t('warehouses.form.postal-code')}} <span class="important">*</span></label>
              <pv-input-text
                  name="postalCode"
                  v-model="form.postalCode"
                  type="text"
                  placeholder="12345"
                  class="form-input"
              />
              <pv-message v-if="$form.postalCode?.invalid" class="form-error">{{ $form.postalCode.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="country">{{$t('warehouses.form.country')}} <span class="important">*</span></label>
              <pv-input-text
                  name="country"
                  v-model="form.country"
                  type="text"
                  placeholder="Perú"
                  class="form-input"
              />
              <pv-message v-if="$form.country?.invalid" class="form-error">{{ $form.country.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="max-temperature">{{$t('warehouses.form.max-temperature')}} <span class="important">*</span></label>
              <pv-input-text
                  name="maxTemperature"
                  v-model="form.maxTemperature"
                  type="number"
                  placeholder="10"
                  class="form-input"
                  min="0"
                  max="50"
              />
              <pv-message v-if="$form.maxTemperature?.invalid" class="form-error">{{ $form.maxTemperature.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group">
              <label for="min-temperature">{{$t('warehouses.form.min-temperature')}} <span class="important">*</span></label>
              <pv-input-text
                  name="minTemperature"
                  v-model="form.minTemperature"
                  type="number"
                  placeholder="-10"
                  class="form-input"
                  min="-50"
                  max="50"
              />
              <pv-message v-if="$form.minTemperature?.invalid" class="form-error">{{ $form.minTemperature.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group full-width">
              <label for="capacity">{{$t('warehouses.form.capacity')}} (m²) <span class="important">*</span></label>
              <pv-input-text
                  name="capacity"
                  v-model="form.capacity"
                  type="number"
                  placeholder="1000"
                  class="form-input"
                  min="1"
              />
              <pv-message v-if="$form.capacity?.invalid" class="form-error">{{ $form.capacity.errors?.[0]?.message }}</pv-message>
            </div>

            <div class="form-group full-width image-section">
              <label>{{ $t('warehouses.form.warehouse-image') }}</label>
              <div class="image-upload-container">
                <label for="file-upload" class="upload-button">
                  <span>+ {{ $t('components.upload-file') }}</span>
                  <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      @change="onFileSelect"
                      style="display: none;"
                  >
                </label>
                <span class="file-name">{{ selectedFile ? selectedFile.name : $t('components.no-chosen-file') }}</span>
              </div>

              <div v-if="existingImageUrl && !newImagePreview" class="image-preview">
                <p>{{ $t('components.actual-image') }}:</p>
                <img :src="existingImageUrl" alt="Imagen actual del almacén">
              </div>

              <div v-if="newImagePreview" class="image-preview">
                <p>{{ $t('components.preview') }}:</p>
                <img :src="newImagePreview" alt="Vista previa de la nueva imagen">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" @click="onCancel">
              {{ $t('components.cancel') }}
            </button>
            <button type="submit" class="submit-button">
              {{ isEditMode ? $t('components.update') : $t('components.save') }}
            </button>
          </div>
        </pv-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-bg {
  background: #F7EDDC;
  min-height: 100vh;
  display: flex;
}

.warehouse-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-content {
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
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
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

.input-error {
  border-color: #e53935 !important;
}

.form-error {
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.important {
  color: #ea1c18;
}

</style>