<script>
import {SelectButton as PvSelectButton} from "primevue";
import {defaultOptions as $i18n} from "@primevue/core/config";

export default {
  name: "language-switcher",
  components: {PvSelectButton},
  data() {
    return {
      selectedLocale: this.$i18n.locale,
      languages: this.$i18n.availableLocales,
      isSwitching: false
    };
  },
  created() {
    this.languages = this.$i18n.availableLocales;
  },
  watch: {
    selectedLocale(newLocale) {
      if (this.isSwitching) return;
      if (!this.languages.includes(newLocale)) return;

      this.isSwitching = true;
      this.$i18n.locale = newLocale;

      setTimeout(() => {
        this.isSwitching = false;
      }, 300);
    }
  }
}
</script>

<template>
  <pv-select-button v-model="selectedLocale" :options="languages">
    <template #option="slotProps">
      {{ slotProps.option.toUpperCase() }}
    </template>
  </pv-select-button>
</template>

<style scoped>

</style>