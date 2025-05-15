<script>
export default {
  name: 'plan-details'
}
</script>

<template>
  <section class="plans-container">
    <h2 class="plans-title">Plans</h2>
    <div class="plans">
      <div class="plan-card free">
        <h3>Free</h3>
        <ul>
          <li>Seguimiento del inventario</li>
          <li>Guías de almacenamiento</li>
          <li>Alertas básicas</li>
        </ul>
      </div>

      <div class="plan-card premium">
        <h3>Premium</h3>
        <p class="price">S/. 19.90</p>
        <ul>
          <li>Soporte prioritario</li>
          <li>Alertas personalizadas</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.plans-container {
  background-color: #f4ede3;
  padding: 40px 20px;
  text-align: center;
}

.plans-title {
  color: #8E24AA;
  font-size: 3rem;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  margin-bottom: 30px;
}

.plans {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.plan-card {
  margin-top: 40px;
  border-radius: 16px;
  padding: 30px 20px;
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.plan-card h3 {
  margin-bottom: 60px;
  font-size: 2.5rem;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-card li {
  font-size: 1.8rem;
  margin-bottom: 40px;
}

.free {
  border: 8px solid #8E24AA;
  color: #8E24AA;
  background-color: #ffffff;
  border-radius: 45px;
}

.premium {
  background-color: #273238;
  color: #ffffff;
  border-radius: 45px;
}

.premium .price {
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0 20px;
}

@media (max-width: 768px) {
  .plans {
    flex-direction: column;
    align-items: center;
  }

  .plan-card {
    width: 90%;
    max-width: 300px;
  }
}
</style>