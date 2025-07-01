<template>
  <div class="resupply-plan-create-grid">
    <h1 class="titulo">{{ editMode ? 'Edit Plan' : 'New Plan' }}</h1>
    <form @submit.prevent="handleSubmit" class="form-grid">
      <div class="form-label-input">
        <label>Destination Liquor Store</label>
        <input v-model="form.licoreria" type="text" />
      </div>
      <div class="form-label-input">
        <label>Quantity suggested</label>
        <div class="cantidad-input">
          <input v-model.number="form.cantidad" type="number" min="1" />
          <span>ud</span>
        </div>
      </div>
      <div class="form-label-input">
        <label>Included Products</label>
        <MultiSelect
          v-if="productos && productos.length"
          v-model="form.productos"
          :options="productos"
          optionLabel="name"
          optionValue="id"
          placeholder="Select products"
          :showToggleAll="false"
          :filter="true"
          class="multiselect-productos"
          :maxSelectedLabels="1"
          :selectedItemsLabel="selectedItemsLabel"
          :panelClass="'multiselect-panel'"
        />
      </div>
      <div class="form-label-input">
        <label>Start date</label>
        <input v-model="form.fechaInicio" type="date" />
      </div>
      <div class="form-label-input">
        <label>Expiration date</label>
        <input v-model="form.fechaVencimiento" type="date" />
      </div>
      <div class="form-label-input full-width" v-if="error">
        <div class="error-message">
          <span class="icon">&#10006;</span> {{ error }}
        </div>
      </div>
      <div class="form-label-input full-width form-actions">
        <button type="submit" class="guardar">SAVE</button>
        <button type="button" class="cancelar" @click="$emit('cancelar')">CANCEL</button>
      </div>
    </form>
  </div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';

export default {
  name: 'ResupplyPlanCreateAndEdit',
  components: { MultiSelect },
  props: {
    productos: {
      type: Array,
      required: true
    },
    initialPlan: {
      type: Object,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        licoreria: '',
        productos: [],
        cantidad: 1,
        fechaInicio: '',
        fechaVencimiento: '',
        frecuencia: '',
        estado: ''
      },
      error: ''
    }
  },
  watch: {
    initialPlan: {
      immediate: true,
      handler(plan) {
        if (this.editMode && plan) {
          this.form = {
            licoreria: plan.licoreria || '',
            productos: Array.isArray(plan.productos) ? plan.productos.map(id => String(id)) : [],
            cantidad: plan.cantidad || 1,
            fechaInicio: plan.fechaInicio || '',
            fechaVencimiento: plan.fechaVencimiento || '',
            frecuencia: plan.frecuencia || '',
            estado: plan.estado || ''
          };
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.form.licoreria || !this.form.productos.length || !this.form.cantidad || !this.form.fechaInicio || !this.form.fechaVencimiento) {
        this.error = 'Por favor, complete todos los campos antes de guardar';
        return;
      }
      this.error = '';
      this.$emit('guardar', this.form);
    },
    selectedItemsLabel(items) {
      if (items.length === 1) {
        const prod = this.productos.find(p => p.id === items[0]);
        return prod ? prod.name : '';
      }
      if (items.length > 1) return 'Varios productos';
      return '';
    }
  }
}
</script>

<style scoped>
.resupply-plan-create-grid {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2rem 1rem 2rem;
  background: transparent;
}
.titulo {
  font-size: 3rem;
  font-weight: bold;
  color: #6F0082;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.7rem 2.5rem;
  background: transparent;
}
.form-label-input {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.full-width {
  grid-column: 1 / 3;
}
label {
  font-weight: bold;
  color: #32312F;
  font-size: 1.25rem;
  font-family: 'Inter', sans-serif;
}
input[type="text"],
input[type="date"],
input[type="number"],
.multiselect-productos {
  width: 100%;
  padding: 0.55rem 0.9rem;
  border-radius: 12px;
  border: 3px solid #6c186f;
  font-size: 1.08rem;
  background: #f6eddf;
  color: #2d1a2d;
  box-sizing: border-box;
  height: 44px;
}
.cantidad-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.multiselect-productos {
  margin-top: 0;
  background: #f6eddf;
  border: 3px solid #6c186f !important;
  border-radius: 12px !important;
  min-height: 44px;
  font-size: 1.08rem;
}
.p-multiselect-panel, .multiselect-panel {
  background: #fff !important;
  border-radius: 16px !important;
  box-shadow: 0 2px 8px #0002 !important;
  border: 2px solid #6c186f !important;
  padding: 0.5rem 0.2rem;
}
.p-multiselect-item {
  color: #2d1a2d !important;
  font-size: 1.08rem;
  padding: 0.5rem 1.2rem !important;
}
.p-checkbox-box.p-highlight {
  border-color: #6c186f !important;
  background: #6c186f !important;
}
.p-checkbox .p-checkbox-box {
  border-radius: 6px !important;
  border: 2px solid #6c186f !important;
}
.p-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon {
  color: #fff !important;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 0.2rem;
}
button.guardar {
  background: #6c186f;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 0.5rem 2.2rem;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  height: 44px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
button.guardar:hover {
  background: #8E24AA;
}
button.cancelar {
  background: #fff;
  color: #6c186f;
  border: 3px solid #6c186f;
  border-radius: 24px;
  padding: 0.5rem 2.2rem;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  height: 44px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
button.cancelar:hover {
  background: #f6eddf;
  color: #8E24AA;
}
.error-message {
  background: #ffd6d6;
  color: #b71c1c;
  border-radius: 12px;
  padding: 1.1rem 1.5rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
  width: 100%;
  box-sizing: border-box;
}
.icon {
  font-size: 1.5rem;
}
</style> 