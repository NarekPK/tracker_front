<template>
  <q-page class="role-page row items-start justify-start">
    <Role />
  </q-page>
</template>

<script setup lang="ts">
import Role from 'src/modules/roles/components/role.vue'

defineOptions({
  name: 'RolePage'
});

</script>

<style lang="sass" scoped>
.role-page
  max-width: 1024px
  margin: 0 auto
</style>
