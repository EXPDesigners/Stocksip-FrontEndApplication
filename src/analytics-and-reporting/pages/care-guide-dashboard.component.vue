<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import CareGuideList from "@/analytics-and-reporting/components/care-guide-list.component.vue";
import {CareGuide} from "@/analytics-and-reporting/model/care-guide.entity.js";
import CareGuideDetail from "@/analytics-and-reporting/components/care-guide-detail.component.vue";

export default {
  name: "care-guide-dashboard",
  components: {
    CareGuideDetail,
    SideNavbar,
    CareGuideList
  },
  data() {
    return {
      filtro: '',
      tipoFiltro: '',
      selectedGuide: null,
      guides: []
    }
  },
  mounted() {
    this.loadGuides()
  },
  computed: {
    filteredGuides() {
      return this.guides.filter(g => {
        const matchFiltro = this.filtro === '' || g.nombre.toLowerCase().includes(this.filtro.toLowerCase())
        const matchTipo = this.tipoFiltro === '' || g.tipo === this.tipoFiltro
        return matchFiltro && matchTipo
      })
    }
  },
  methods: {
    loadGuides() {
      const defaultGuides = [
        new CareGuide({
          id: 1,
          nombre: 'Ron Cartavio',
          tipo: 'Ron',
          descripcion: 'Ron oscuro peruano de excelente calidad.',
          imagen: 'https://i.imgur.com/6qjK5XY.png'
        }),
        new CareGuide({
          id: 2,
          nombre: 'Whisky Jameson',
          tipo: 'Whisky',
          descripcion: 'Whisky irlandés suave y frutal.',
          imagen: 'https://i.imgur.com/6qjK5XY.png'
        })
      ]
      const stored = JSON.parse(localStorage.getItem('careGuides') || '[]')
      const userGuides = stored.map(g => new CareGuide(g))

      // Combinar ambas
      this.guides = [...defaultGuides, ...userGuides]
    },
    editGuide(guide) {
      this.$router.push({ name: 'care-guide-edit', params: { id: guide.id } })
    }
  }
}
</script>

<template>
  <div class="care-guide-bg">
    <side-navbar />
    <div class="care-guide-main">
      <h1 class="title">Conservation Guides</h1>
      <!-- Card: buscador -->
      <div class="card-search">
        <div class="filter-row">
          <input type="text" v-model="filtro" placeholder="Search by name or type..." />
          <select v-model="tipoFiltro">
            <option value="">All</option>
            <option value="Ron">Ron</option>
            <option value="Whisky">Whisky</option>
            <option value="Vodka">Vodka</option>
          </select>
          <button class="btn nuevo" @click="$router.push({ name: 'care-guide-create' })">
            New guide
          </button>
        </div>
      </div>
      <!-- Card: listado -->
      <div class="card">
        <h2 class="subtitle">Products with a guide</h2>
        <care-guide-list
            :guides="filteredGuides"
            @ver-detalle="selectedGuide = $event"
            @editar="editGuide"
        />
      </div>
      <care-guide-detail
          v-if="selectedGuide"
          :producto="selectedGuide"
          @close="selectedGuide = null"
      />
    </div>
  </div>
</template>

<style scoped>
.care-guide-bg {
  display: flex;
  min-height: 100vh;
  background: #f7eddc;
}
.care-guide-main {
  flex: 1;
  padding: 2rem;
}
.title {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.card-search {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  gap: 1rem;
}
.filter-row {
  display: flex;
  gap: 1rem;
}
h1{
  color: #6F0082;
  font-family: 'Poppins', sans-serif;
}
h2{
  color: #26021C;
  font-family: 'Inter Semi Bold', sans-serif;
}
.filter-row input,
.filter-row select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.btn.nuevo {
  background: #5A033A;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 26px;
  font-weight: bold;
}
.subtitle {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>