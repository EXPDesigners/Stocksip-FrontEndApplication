<script>


export default {
  name: 'toolbar-content',
  props: {
    pageTitle: {
      type: String,
      default: 'Default Title'
    }
  },
}
</script>

<template>
  <pv-menubar>
    <template #start>
      <pv-button icon="pi pi-bars" class="p-button-text" />
      <h1 class="toolbar-title">{{ pageTitle }}</h1>
    </template>


    <template #end>
      <div class="flex items-center gap-2">
        Profile
      </div>
    </template>
  </pv-menubar>
</template>

<style scoped>

.spacer {
  flex: 1 1 auto;
}

.toolbar-title {
  padding-left: 2rem;
  color: #6F0082;
  font-weight: Bold;
  font-size: 50px
}

</style>