<template>
  <q-page class="row items-center justify-evenly">
    <login-form title="Login" />
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'src/modules/auth/components/LoginForm.vue'

defineOptions({
  name: 'LoginPage'
});

</script>
