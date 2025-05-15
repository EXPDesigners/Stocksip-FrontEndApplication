<script>
import SideNavbar from "@/public/components/side-navbar.vue";
import ToolbarContent from "@/public/components/toolbar-content.component.vue";

export default {
  name: "alert-dashboard",
  components: {ToolbarContent, SideNavbar},
  data() {
    return {
      stockAlerts: [
        { name: 'Whisky Escocés Premium', stock: 5, minStock: 10 },
        { name: 'Cerveza Artesanal IPA', stock: 8, minStock: 12 },
        { name: 'Whisky Escocés Premium', stock: 5, minStock: 10 }
      ],
      expirationAlerts: [
        { name: 'Vino Tinto Malbec', expiresIn: 5 },
        { name: 'Gin Botánico', expiresIn: 10 },
        { name: 'Cerveza 1', expiresIn: 15 },
        { name: 'Vino Blanco Malbec', expiresIn: 16 }
      ]
    }
  }
}
</script>

<template>
  <div class="alerts-bg">
    <side-navbar />
    <div class="alerts-main">
      <toolbar-content :pageTitle="'Alerts'" />
      <div class="alerts-content">
        <!-- Reposición urgente -->
        <div class="alert-card">
          <h2 class="card-title">Urgent Repositioning</h2>
          <div v-for="(item, index) in stockAlerts" :key="index" class="alert-item">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-critical">Actual stock: {{ item.stock }}</p>
            <p class="item-min">Minimum stock: {{ item.minStock }}</p>
          </div>
          <a href="#" class="card-link">View all alerts</a>
        </div>
        <!-- Próximos a vencer -->
        <div class="alert-card">
          <h2 class="card-title">Next to expire</h2>
          <div v-for="(item, index) in expirationAlerts" :key="index" class="alert-item">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-expiring">Expires in {{ item.expiresIn }} days!</p>
          </div>
          <a href="#" class="card-link">See all products</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts-bg {
  background: #f7eddc;
  min-height: 100vh;
  width: 100vw;
  display: flex;
}

.alerts-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alerts-content {
  padding: 2rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.alert-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(38, 2, 29, 0.07);
  flex: 1 1 320px;
  min-width: 280px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #26021d;
}

.alert-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.item-name {
  font-weight: 600;
}

.item-critical {
  color: #d90429;
  font-size: 0.95rem;
}

.item-min {
  font-size: 0.95rem;
  color: #555;
}

.item-expiring {
  color: #d98c4a;
  font-weight: bold;
  font-size: 0.95rem;
}

.card-link {
  font-size: 0.95rem;
  color: #6e0081;
  text-decoration: underline;
}
.card-link:hover {
  color: #59033a;
}
</style>
