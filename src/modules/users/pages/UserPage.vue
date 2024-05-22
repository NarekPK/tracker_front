<template>
  <q-page class="user-page row items-start justify-start">
    <user title="User" />
  </q-page>
</template>

<script setup lang="ts">
import User from 'src/modules/users/components/user.vue'

defineOptions({
  name: 'UserPage'
});

</script>

<style lang="sass" scoped>
.user-page
  max-width: 1024px
  margin: 0 auto
</style>