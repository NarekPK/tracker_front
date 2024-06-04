<template>
  <q-page class="users-page row items-start justify-start">
    <users />
  </q-page>
</template>

<script setup lang="ts">
import Users from 'src/modules/users/components/users.vue'

defineOptions({
  name: 'UsersPage'
});

</script>

<style lang="sass" scoped>
.users-page
  max-width: 1024px
  margin: 0 auto
</style>
