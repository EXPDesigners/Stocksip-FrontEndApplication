<script>
import SideNavbar from '@/public/components/side-navbar.vue'
import ReportList from '/src/analytics-and-reporting/components/report-list.component.vue'
import { Report } from '/src/analytics-and-reporting/model/report.entity.js'

export default {
  name: 'report-management',
  components: {
    SideNavbar,
    ReportList
  },
  data() {
    return {
      reports: []
    }
  },
  mounted() {
    this.loadReports()
  },
  methods: {
    loadReports() {
      const stored = localStorage.getItem('reports')
      const parsed = stored ? JSON.parse(stored) : []
      this.reports = parsed.map(item => new Report(item))

      if (!this.reports.length) {
        this.reports = [
          new Report({ nombre: 'Vino Malbec', tipo: 'Destilatado', precio: 25, cantidad: 2 }),
          new Report({ nombre: 'Gin Botánico', tipo: 'Vino', precio: 45, cantidad: 1 })
        ]
        localStorage.setItem('reports', JSON.stringify(this.reports))
      }
    },
    generateReport() {
      this.$router.push({ name: 'report-create' })
    },
    editReport(index) {
      this.$router.push({ name: 'report-edit', params: { id: index } })
    },
    deleteReport(index) {
      if (confirm('¿Eliminar este reporte?')) {
        this.reports.splice(index, 1)
        localStorage.setItem('reports', JSON.stringify(this.reports))
      }
    }
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
        <button class="nav-btn active">Loss Reporting</button>
        <button class="nav-btn">Care</button>
        <button class="nav-btn">Conservation</button>
      </div>

      <div class="report-subheader">
        <h2 class="subtitle">Loss Report Form</h2>
        <button class="generate-btn" @click="generateReport">Generate Report</button>
      </div>

      <report-list
          :reports="reports"
          @edit="editReport"
          @delete="deleteReport"
      />
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
  font-size: 3rem;
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
.report-subheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.generate-btn,
.create-btn {
  background: #5A033A;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  margin-top: 1rem;
}
.report-table th,
.report-table td {
  padding: 0.9rem 3rem;
  border-bottom: 1px solid #eee;
}
</style>