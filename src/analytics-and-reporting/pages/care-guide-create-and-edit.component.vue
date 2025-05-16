<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import {CareGuide} from "@/analytics-and-reporting/model/care-guide.entity.js";

export default {
  name: "care-guide-create-and-edit",
  components: {
    SideNavbar
  },
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mounted() {
    if (this.id) {
      const stored = JSON.parse(localStorage.getItem('careGuides') || '[]')
      const guide = stored.find(g => g.id === parseInt(this.id))
      if (guide) this.form = guide
    }
  },
  data() {
    return {
      form: { nombre: '', tipo: '', descripcion: '', imagen: '' },
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    cargarImagen(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => {
        this.form.imagen = e.target.result
      }
      reader.readAsDataURL(file)
    },
    guardar() {
      this.successMessage = ''
      this.errorMessage = ''

      if (!this.form.nombre || !this.form.tipo || !this.form.descripcion || !this.form.imagen) {
        this.errorMessage = 'Por favor, complete todos los campos antes de guardar'
        return
      }

      const all = JSON.parse(localStorage.getItem('careGuides') || '[]')
      const updated = all.filter(g => g.id !== parseInt(this.id)) // Si estamos editando

      const newGuide = {
        ...this.form,
        id: this.id ? parseInt(this.id) : Date.now()
      }

      localStorage.setItem('careGuides', JSON.stringify([...updated, newGuide]))
      this.successMessage = ` Guía registrada correctamente para el tipo de licor: ${this.form.tipo}`
    },
    cancelar() {
      this.$router.push({ name: 'care-guide' })
    },
    eliminar() {
      if (!this.id) return
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta guía?')
      if (!confirmDelete) return

      const stored = JSON.parse(localStorage.getItem('careGuides') || '[]')
      const updated = stored.filter(g => g.id !== parseInt(this.id))
      localStorage.setItem('careGuides', JSON.stringify(updated))

      alert('✅ Guía eliminada perfectamente')
      this.$router.push({ name: 'care-guide-dashboard' })
    }
  },
  computed: {
    esEdicion() {
      return !!this.id
    },
    tituloFormulario() {
      return this.esEdicion ? 'Editar Guía' : 'Nueva Guía'
    }
  }
}
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
        <div class="form-row">
          <div class="form-group">
            <label>Nombre del producto</label>
            <input v-model="form.nombre" type="text" required />
          </div>

          <div class="form-group image-group">
            <label>Insertar imagen</label>
            <input type="file" accept="image/*" @change="cargarImagen" />
            <img v-if="form.imagen" :src="form.imagen" class="preview" />
          </div>
        </div>

        <div class="form-group">
          <label>Tipo</label>
          <input v-model="form.tipo" type="text" required />
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="form.descripcion" rows="4" required></textarea>
        </div>

        <div v-if="successMessage" class="alert success">
          <i class="pi pi-check"></i> {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert error">
          <i class="pi pi-times"></i> {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn save">Guardar</button>
          <button type="button" class="btn cancel" @click="cancelar">Cancelar</button>
          <button v-if="id" type="button" class="btn delete" @click="eliminar">Eliminar</button>
        </div>
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
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.save {
  background: #5A033A;
  color: white;
  border-radius: 28px;
}
.cancel {
  background: white;
  color: #6F0082;
  border-radius: 28px;
  border: 2px solid #6E0081;
}
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: bold;
}
.success {
  background: #d4edda;
  color: #155724;
}
.error {
  background: #f8d7da;
  color: #721c24;
}
.btn.delete {
  background: #D90429;
  color: white;
  margin-left: auto;
}
</style>