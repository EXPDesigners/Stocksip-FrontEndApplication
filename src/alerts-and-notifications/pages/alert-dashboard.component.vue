<script>
export default {
  name: 'Alerts',
  data() {
    return {
      stockAlerts: [
        { name: 'Whisky Escocés Premium', stock: 5, min: 10 },
        { name: 'Cerveza Artesanal IPA', stock: 8, min: 12 },
        { name: 'Whisky Escocés Premium', stock: 5, min: 10 }
      ],
      expirations: [
        { name: 'Vino Tinto Malbec', days: 5 },
        { name: 'Gin Botánico', days: 10 },
        { name: 'Cerveza 1', days: 15 },
        { name: 'Vino Blanco Malbec', days: 16 }
      ]
    }
  }
}
</script>

<template>
  <div class="alerts-main">
    <h1>Alerts</h1>
    <div class="alert-container">
      <pv-card class="card">
        <template #title>
          <h2>Urgent Repositioning</h2>
        </template>
        <template #content>
          <div v-for="(item, i) in stockAlerts" :key="i" class="item">
            <p>{{ item.name }}</p>
            <p><span class="danger">Actual stock: {{ item.stock }}</span></p>
            <p>Minimum stock: {{ item.min }}</p>
            <hr v-if="i !== stockAlerts.length - 1" />
          </div>
          <a>View all alerts</a>
        </template>
      </pv-card>
      <pv-card class="card">
        <template #title>
          <h2>Next to expire</h2>
        </template>
        <template #content>
          <div v-for="(item, i) in expirations" :key="i" class="item">
            <p>{{ item.name }}</p>
            <p class="warning">Expires in {{ item.days }} days!</p>
            <hr v-if="i !== expirations.length - 1" />
          </div>
          <a>See all products</a>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.alerts-main {
  background-color: #F6EDDC;
  min-height: 97.7vh;
  padding: 16px;
}

h1 {
  color: #6F0082;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 20px;
  font-size: 50px;
}

.alert-container {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.card {
  background-color: #F6EDDC;
  flex: 1 1 400px;
  padding: 16px;
}

h2 {
  color: #26021C;
  font-family: 'Inter Semi Bold', sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.danger {
  color: red;
}

.warning {
  color: orange;
}

.item {
  color: #32312F;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

a {
  color: purple;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 12px;
  display: inline-block;
  font-family: 'Inter', sans-serif;
}
</style>
