<script>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import httpInstance from "@/shared/services/http.instance.js"
import { SubscriptionService } from "@/payment-and-subscriptions/services/subscription.service.js"

export default {
  name: "payment-upgrade-success",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const subscriptionService = new SubscriptionService()

    onMounted(async () => {
      const token = route.query.token
      const accountId = route.query.accountId
      const planId = route.query.planId

      if (!token || !accountId || !planId) {
        return router.push({ name: 'sign-in' })
      }

      try {
        const response = await subscriptionService.completeUpgrade(token, accountId, planId)
        console.log('Upgrade complete:', response)
      } catch (error) {
        console.error('Error completing upgrade:', error)
      }
    })

    const goToDashboard = () => {
      router.push('/dashboard')
    }

    return { goToDashboard }
  }
}
</script>

<template>
  <p>Tu plan ha sido actualizado exitosamente.</p>
  <p>¡Gracias por mejorar tu suscripción!</p>
  <button @click="goToDashboard">Ir al Dashboard</button>
</template>