<template>
  <div class="resupply-plan-alerts">
    <h3>Plans to expire</h3>
    <div class="alert-box">
      <span class="icon">⚠️</span>
      <span>{{ expiringCount }} plans expire in the last 3 days</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResupplyPlanAlerts',
  props: {
    expiringCount: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.resupply-plan-alerts {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  padding: 16px;
}
.alert-box {
  background: #ffe0b2;
  color: #7a4f01;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.icon {
  font-size: 1.5em;
}
</style> 