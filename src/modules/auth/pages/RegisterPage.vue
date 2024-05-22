<template>
  <q-page class="row items-center justify-evenly">
    <register-form title="Register" />
  </q-page>
</template>

<script setup lang="ts">
import RegisterForm from 'src/modules/auth/components/RegisterForm.vue'

defineOptions({
  name: 'RegisterPage'
});

</script>
