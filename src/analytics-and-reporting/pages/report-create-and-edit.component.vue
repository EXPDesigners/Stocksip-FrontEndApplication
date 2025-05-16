<script>
import SideNavbar from '@/public/components/side-navbar.vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, computed } from 'vue'

export default {
  name: 'reports-create-and-edit',
  components: { SideNavbar },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const id = route.params.id

    const reports = JSON.parse(localStorage.getItem('reports') || '[]')

    const existing = id !== undefined ? reports[parseInt(id)] : null

    const form = reactive({
      nombre: existing?.nombre || '',
      tipo: existing?.tipo || '',
      precio: existing?.precio || 0,
      cantidad: existing?.cantidad || 0,
      fecha: existing?.fecha || new Date().toISOString().substring(0, 10)
    })

    const totalCosto = computed(() => `S/. ${(form.precio * form.cantidad).toFixed(2)}`)

    const handleSubmit = () => {
      if (id !== undefined) {
        reports[parseInt(id)] = { ...form }
      } else {
        reports.push({ ...form })
      }
      localStorage.setItem('reports', JSON.stringify(reports))
      router.push('/reports')
    }

    const cancelar = () => {
      router.push('/reports')
    }

    return { form, totalCosto, handleSubmit, cancelar }
  }
}
</script>

<template>
  <div class="report-bg">
    <side-navbar />
    <div class="report-main">
      <h1 class="title">Reports</h1>

      <div class="report-nav">
        <button class="nav-btn">Internal referral</button>
        <button class="nav-btn active">Loss reporting</button>
        <button class="nav-btn">Care</button>
        <button class="nav-btn">Conservation</button>
      </div>

      <h2 class="subtitle">Loss Report Form</h2>

      <form @submit.prevent="handleSubmit" class="report-form">
        <div class="form-group">
          <label>Product name</label>
          <input v-model="form.nombre" required />
        </div>
        <div class="form-group">
          <label>Type</label>
          <input v-model="form.tipo" required />
        </div>
        <div class="form-group">
          <label>Price</label>
          <input type="number" v-model.number="form.precio" required />
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" v-model.number="form.cantidad" required />
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="form.fecha" required />
        </div>
        <div class="form-group">
          <label>Total lost cost</label>
          <input :value="totalCosto" readonly />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn save">Save</button>
          <button type="button" class="btn cancel" @click="cancelar">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.report-bg {
  display: flex;
  background: #f7eddc;
  min-height: 100vh;
}
.report-main {
  flex: 1;
  padding: 2rem;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  color: #26021D;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
.report-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  justify-content: space-between;
}
.nav-btn {
  background: #fff;
  width: 31vh;
  height: 8vh;
  border: 2px solid #6E0081;
  padding: 0.3rem 2rem;
  border-radius: 28px;
  font-weight: bold;
  margin-left: 50px;
  font-size: 1.3rem;
}
.nav-btn.active,
.nav-btn:hover {
  background: #5A033A;
  color: white;
}
.subtitle {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
}
.report-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(38, 2, 29, 0.07);
  max-width: 600px;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.btn {
  padding: 0.7rem 1.4rem;
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
</style>