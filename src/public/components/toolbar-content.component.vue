<script>

import LanguageSwitcher from "@/public/components/language-switcher.component.vue";

export default {
  name: 'toolbar-content',
  components: {LanguageSwitcher},
  props: {
    pageTitle: {
      type: String,
      default: 'Default Title'
    }
  },
}
</script>

<template>
  <pv-menubar class="custom-toolbar">
    <template #start>
      <h1 class="toolbar-title">{{ pageTitle }}</h1>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
      </div>
      <div class="p-5">
        <language-switcher></language-switcher>
      </div>
    </template>
  </pv-menubar>
</template>

<style scoped>

.spacer {
  flex: 1 1 auto;
}

.custom-toolbar {
  background-color: #F7EDDC !important;
  color: #6E0081 !important;
  border: none !important;
  font-family: 'Poppins', sans-serif;
}


.toolbar-title {
  padding-left: 2rem;
  background-color: #F7EDDC;
  color: #6E0081;
  width: 100%;
  font-weight: Bold;
  font-size: 50px;
  font-family: 'Poppins', sans-serif;
}

</style>