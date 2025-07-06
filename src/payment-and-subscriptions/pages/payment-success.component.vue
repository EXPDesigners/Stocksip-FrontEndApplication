<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import httpInstance from "@/shared/services/http.instance.js";

const route = useRoute()

onMounted(async () => {
  const token = route.query.token
  const accountId = route.query.accountId
  const planId = route.query.planId

  try {
    const response = await httpInstance.get('http://localhost:5043/api/v1/payments/success', {
      params: {
        token,
        accountId,
        planId
      }
    })

    console.log('Suscripción completada:', response.data)
  } catch (error) {
    console.error('Error al completar el pago:', error)
  }
})
</script>

<template>
  <p>Tu suscripción ha sido activada correctamente.</p>
</template>

<style scoped>

</style>