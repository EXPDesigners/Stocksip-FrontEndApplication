<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import CareGuideList from "@/inventory-management/components/care-guide-list.component.vue";
import CareGuideDetail from "@/inventory-management/components/care-guide-detail.component.vue";
import { CareGuideService } from '../services/care-guide.service.js';

export default {
  name: "care-guide-dashboard",
  components: {
    CareGuideDetail,
    SideNavbar,
    CareGuideList
  },
  data() {
    return {
      guides: [],
      selectedGuide: null,
      searchQuery: '',
      selectedType: 'all',
      loading: false,
      error: null
    }
  },
  computed: {
    filteredGuides() {
      if (!this.guides) return [];
      return this.guides.filter(guide => {
        if (!guide || !guide.name) return false;
        const matchesSearch = guide.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesType = this.selectedType === 'all' || guide.type === this.selectedType;
        return matchesSearch && matchesType;
      });
    }
  },
  methods: {
    async loadGuides() {
      this.loading = true;
      this.error = null;
      try {
        const response = await CareGuideService.getAll();
        this.guides = response || [];
      } catch (error) {
        this.error = error.message;
        console.error('Error al cargar las guías:', error);
        this.guides = [];
      } finally {
        this.loading = false;
      }
    },
    async handleSearch() {
      if (!this.searchQuery) {
        await this.loadGuides();
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await CareGuideService.searchByName(this.searchQuery);
        this.guides = response || [];
      } catch (error) {
        this.error = error.message;
        console.error('Error al buscar guías:', error);
        this.guides = [];
      } finally {
        this.loading = false;
      }
    },
    async handleTypeFilter() {
      if (this.selectedType === 'all') {
        await this.loadGuides();
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await CareGuideService.getByType(this.selectedType);
        this.guides = response || [];
      } catch (error) {
        this.error = error.message;
        console.error('Error al filtrar por tipo:', error);
        this.guides = [];
      } finally {
        this.loading = false;
      }
    },
    async handleEdit(guide) {
      this.$router.push(`/reports/conservations/${guide.id}/edit`);
    },
    async handleDelete(guideId) {
      if (!confirm('¿Estás seguro de que deseas eliminar esta guía?')) {
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        await CareGuideService.delete(guideId);
        this.guides = this.guides.filter(g => g.id !== guideId);
        if (this.selectedGuide?.id === guideId) {
          this.selectedGuide = null;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error al eliminar la guía:', error);
      } finally {
        this.loading = false;
      }
    },
    createGuide() {
      const maxId = this.guides.length > 0 ? Math.max(...this.guides.map(g => Number(g.id) || 0)) : 0;
      const newId = maxId + 1;
      this.$router.push(`/reports/conservations/${newId}/new`);
    }
  },
  async mounted() {
    this.guides = [];
    await this.loadGuides();
  }
}
</script>

<template>
  <div class="dashboard-container">
    <SideNavbar />
    <div class="main-content">
      <div class="header">
        <h1>Conservation Guides</h1>
      </div>

      <div class="card-search">
        <div class="filter-row-with-btn">
          <div class="filter-row">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name..."
                @input="handleSearch"
            />
            <select v-model="selectedType" @change="handleTypeFilter">
              <option value="all">All</option>
              <option value="Ron">Ron</option>
              <option value="Whisky">Whisky</option>
              <option value="Vodka">Vodka</option>
              <option value="Vino">Vino</option>
              <option value="Pisco">Pisco</option>
            </select>
          </div>
          <button class="btn-primary create-btn" @click="createGuide">
            <i class="fas fa-plus"></i> New Guide
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading guides...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button class="btn-secondary" @click="loadGuides">Retry</button>
      </div>

      <div v-else class="content-container">
        <div class="list-container">
          <CareGuideList
              :guides="filteredGuides"
              @ver-detalle="selectedGuide = $event"
              @editar="handleEdit"
              @eliminar="handleDelete"
          />
        </div>
        <div class="detail-container" v-if="selectedGuide">
          <CareGuideDetail :guide="selectedGuide" @close="selectedGuide = null" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f7eddc;
}
.main-content {
  flex: 1;
  padding: 2rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
.filter-row-with-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.create-btn {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0 1.2rem;
}
h1{
  font-size: 3rem;
  font-weight: bold;
  color: #6F0082;
  margin-bottom: 1rem;
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

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #e74c3c;
}

.error-container i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-container button {
  margin-top: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>