<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import { CareGuideService } from "../services/care-guide.service.js";
import ImageService from "@/shared/services/image.service.js";

export default {
  name: "care-guide-create-and-edit",
  components: { SideNavbar },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: '',
        imageUrl: '',
        tempMin: '',
        tempMax: '',
        storage: '',
        duration: '',
        comments: ''
      },
      uploading: false,
      loading: false,
      successMessage: '',
      errorMessage: '',
      isEdit: false
    };
  },
  computed: {
    tituloFormulario() {
      return this.isEdit ? 'Editar Guía' : 'Nueva Guía';
    },
    descripcionGenerada() {
      return `Temperatura recomendada: ${this.form.tempMin} - ${this.form.tempMax}°C. Almacenar en ${this.form.storage}. Duración después de abierto: ${this.form.duration}. Comentarios: ${this.form.comments}.`;
    }
  },
  async mounted() {
    // Detectar si es edición por la ruta
    if (this.$route.path.endsWith('/edit')) {
      this.isEdit = true;
      this.loading = true;
      try {
        const guide = await CareGuideService.getById(this.id);
        this.form.name = guide.name;
        this.form.type = guide.type;
        this.form.imageUrl = guide.imageUrl;
        // Parsear la descripción
        const details = guide.parseDescription();
        // Extraer temperaturas
        if (details.temperature && details.temperature.includes('-')) {
          const temps = details.temperature.replace('°C', '').split('-');
          this.form.tempMin = temps[0].trim();
          this.form.tempMax = temps[1].trim();
        } else {
          this.form.tempMin = '';
          this.form.tempMax = '';
        }
        this.form.storage = details.storage;
        this.form.duration = details.duration;
        this.form.comments = details.comments;
      } catch (error) {
        this.errorMessage = error.message || 'No se pudo cargar la guía';
      } finally {
        this.loading = false;
      }
    }
  },
  methods: {
    async cargarImagen(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.uploading = true;
      this.errorMessage = '';
      try {
        const result = await ImageService.uploadImage(file);
        this.form.imageUrl = result.secure_url;
      } catch (error) {
        this.errorMessage = error.message || 'Error al subir la imagen';
      } finally {
        this.uploading = false;
      }
    },
    async guardar() {
      this.successMessage = '';
      this.errorMessage = '';
      const min = parseFloat(this.form.tempMin);
      const max = parseFloat(this.form.tempMax);
      if (
          !this.form.name ||
          !this.form.type ||
          !this.form.imageUrl ||
          this.form.tempMin === '' ||
          this.form.tempMax === '' ||
          isNaN(min) ||
          isNaN(max) ||
          min > max ||
          !this.form.storage ||
          !this.form.duration ||
          !this.form.comments
      ) {
        this.errorMessage = 'Por favor, complete todos los campos correctamente. La temperatura mínima debe ser menor o igual a la máxima y ambos deben ser números.';
        return;
      }
      this.loading = true;
      try {
        const newGuide = {
          name: this.form.name,
          type: this.form.type,
          imageUrl: this.form.imageUrl,
          description: this.descripcionGenerada,
          id: this.id
        };
        if (this.isEdit) {
          await CareGuideService.update(this.id, newGuide);
          this.successMessage = `Guía actualizada correctamente para el tipo de licor: ${this.form.type}`;
        } else {
          await CareGuideService.create(newGuide);
          this.successMessage = `Guía registrada correctamente para el tipo de licor: ${this.form.type}`;
        }
        setTimeout(() => {
          this.$router.push('/reports/conservations');
        }, 1200);
      } catch (error) {
        this.errorMessage = error.message || 'Error al guardar la guía';
      } finally {
        this.loading = false;
      }
    },
    cancelar() {
      this.$router.push('/reports/conservations');
    }
  }
};
</script>

<template>
  <div class="create-guide-page">
    <side-navbar />
    <div class="main">
      <div class="header">
        <button class="back-btn" @click="cancelar">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1>{{ tituloFormulario }}</h1>
      </div>

      <form @submit.prevent="guardar" class="form">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
        <template v-else>
          <div class="form-row">
            <div class="form-group">
              <label>Nombre del producto</label>
              <input v-model="form.name" type="text" required />
            </div>

            <div class="form-group image-group">
              <label>Insertar imagen</label>
              <input type="file" accept="image/*" @change="cargarImagen" :disabled="uploading" />
              <img v-if="form.imageUrl" :src="form.imageUrl" class="preview" />
              <div v-if="uploading" class="uploading">Subiendo imagen...</div>
            </div>
          </div>

          <div class="form-group">
            <label>Tipo</label>
            <input v-model="form.type" type="text" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Temperatura mínima (°C)</label>
              <input v-model="form.tempMin" type="number" step="0.1" min="-100" max="100" required />
            </div>
            <div class="form-group">
              <label>Temperatura máxima (°C)</label>
              <input v-model="form.tempMax" type="number" step="0.1" min="-100" max="100" required />
            </div>
          </div>
          <div class="form-group">
            <label>Almacenamiento</label>
            <input v-model="form.storage" type="text" required placeholder="Ej: lugar fresco y seco" />
          </div>
          <div class="form-group">
            <label>Duración después de abierto</label>
            <input v-model="form.duration" type="text" required placeholder="Ej: 6 meses" />
          </div>
          <div class="form-group">
            <label>Comentarios</label>
            <input v-model="form.comments" type="text" required placeholder="Ej: Mantener la botella en posición vertical" />
          </div>

          <div class="form-group">
            <label>Vista previa de la descripción generada</label>
            <textarea :value="descripcionGenerada" rows="3" readonly style="background:#f5f5f5; color:#333;" />
          </div>

          <div v-if="successMessage" class="alert success">
            <i class="pi pi-check"></i> {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert error">
            <i class="pi pi-times"></i> {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn save" :disabled="loading || uploading">
              {{ loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : (isEdit ? 'Actualizar' : 'Guardar') }}
            </button>
            <button type="button" class="btn cancel" @click="cancelar">Cancelar</button>
          </div>
        </template>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-guide-page {
  display: flex;
  background: #f7eddc;
  min-height: 100vh;
}
.main {
  flex: 1;
  padding: 2rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
  max-width: 700px;
}
h1 {
  color: #6F0082;
  font-family: 'Poppins', sans-serif;
}
label{
  color: #32312F;
  font-family: 'Inter Semi Bold', sans-serif;
}
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: bold;
  margin-bottom: 0.4rem;
}
input[type="text"],
textarea,
input[type="file"] {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.form-row {
  display: flex;
  gap: 2rem;
}
.image-group .preview {
  margin-top: 0.6rem;
  max-width: 160px;
  border-radius: 8px;
}
.uploading {
  color: #6F0082;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
.alert.success {
  color: #2ecc40;
  background: #eafbe7;
  border: 1px solid #b7e4c7;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.alert.error {
  color: #e74c3c;
  background: #fdecea;
  border: 1px solid #f5c6cb;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn.save {
  background: #6F0082;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2rem;
  font-weight: bold;
  cursor: pointer;
}
.btn.cancel {
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2rem;
  font-weight: bold;
  cursor: pointer;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>