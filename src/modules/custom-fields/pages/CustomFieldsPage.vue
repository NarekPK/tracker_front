<template>
  <q-page class="users-page row items-start justify-start">
    <CustomFields />
  </q-page>
</template>

<script setup lang="ts">
import CustomFields from 'src/modules/custom-fields/components/custom-fields.vue'

defineOptions({
  name: 'CustomFieldsPage'
});

</script>

<style lang="sass" scoped>
.users-page
  max-width: 1024px
  margin: 0 auto
</style>
