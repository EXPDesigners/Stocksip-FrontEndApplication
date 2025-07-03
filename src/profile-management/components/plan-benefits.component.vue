<script>
export default {
  name: 'plan-benefits'
}
</script>

<template>
  <div class="plan-benefits-container">
    <h2 class="title">Premium Plan Benefits</h2>

    <div class="description">
      By purchasing the Premium Plan, you'll be able to access the<br>
      following benefits that <strong>StockSip</strong> has to offer:
    </div>

    <div class="benefits-box">
      <ul>
        <li>Acceso a promociones exclusivas</li>
        <li>Pedidos anticipados a proveedores destacados</li>
        <li>Control de stock avanzado</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.plan-benefits-container {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  background-color: #F7EDDC;
  color: #6E0081;
  padding: 40px 0;
  width: 100%;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: #6E0081;
}

.description {
  background-color: #D98C4A;
  padding: 1rem;
  color: white;
  font-size: 1.5rem;
  line-height: 1.5;
  width: 100%;
  margin-bottom: 3rem;
}

.benefits-box {
  background-color: white;
  width: fit-content;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.8rem;
  color: #333;
}

.benefits-box ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  text-align: left;
}

.benefits-box li {
  margin-bottom: 0.75rem;
}

@media (max-width: 768px) {
  .description {
    font-size: 1.5rem;
    padding: 1rem 2rem;
  }

  .benefits-box {
    width: 90%;
    margin: 0 auto;
    font-size: 1.5rem;
  }
}
</style>