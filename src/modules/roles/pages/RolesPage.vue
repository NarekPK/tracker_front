<template>
  <q-page class="roles-page row items-start justify-start">
    <roles />
  </q-page>
</template>

<script setup lang="ts">
import Roles from 'src/modules/roles/components/roles.vue'

defineOptions({
  name: 'RolesPage'
});

</script>

<style lang="sass" scoped>
.roles-page
  max-width: 1024px
  margin: 0 auto
</style>
