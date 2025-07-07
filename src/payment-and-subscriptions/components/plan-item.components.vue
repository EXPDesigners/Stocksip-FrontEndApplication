<script>
const PLAN_RANK = {
  plan_free: 1,
  plan_premium_monthly: 2,
  plan_premium_annual: 3
};

export default {
  name: 'PlanItem',
  props: {
    plan: { type: Object, required: true },
    currentPlanId: { type: String, required: false }
  },
  computed: {
    isCurrentPlan() {
      console.log("Current Plan ID:", this.currentPlanId);
      return this.plan.planId === this.currentPlanId;
    },
    isDowngradeOrSame() {
      const currentRank = PLAN_RANK[this.currentPlanId] || 0;
      const thisRank = PLAN_RANK[this.plan.planId] || 0;
      return thisRank <= currentRank;

    }
  },
  methods: {
    choosePlan() {
      if (!this.isCurrentPlan && !this.isDowngradeOrSame) {
        this.$emit('choose', this.plan.planId);
      }
    }
  }
};
</script>

<template>
  <pv-card class="plan-card">
    <template #header>
      <div class="center-text">
        <h2 class="plan-title">{{ plan.description }}</h2>
      </div>
    </template>

    <template #content>
      <p class="plan-text">PlanType: {{ plan.description }}</p>
      <p class="plan-text">Price: {{ plan.price }}</p>
    </template>

    <template #footer>
      <div class="action-buttons">
        <pv-button :disabled="isCurrentPlan || isDowngradeOrSame" @click="choosePlan">
          {{ isCurrentPlan ? 'Current Plan' : (isDowngradeOrSame ? 'Unavailable' : 'Choose') }}
        </pv-button>
      </div>
    </template>
  </pv-card>
</template>
