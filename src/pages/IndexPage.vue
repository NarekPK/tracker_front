<template>
  <q-page class="column items-center justify-center q-pa-md">
    <div class="main-header flex justify-between items-center">
      <img class="logo q-mb-md" src="~assets/logo.svg" alt="">
      <div class="auth-buttons q-mb-md">
        <q-btn @click="handleLogin" label="Войти" class="q-mr-md text-bold"/>
        <q-btn href="/register" label="Зарегистрироваться" type="submit" color="primary" class="text-bold"/>
      </div>
      <!-- <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" /> -->
    </div>

    <img class="main-page-img" src="~assets/main-page-pic.svg" alt="">
  </q-page>
</template>

<script setup lang="ts">
import { AuthApiService } from 'src/modules/auth/services'
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'IndexPage'
})

async function handleLogin () {
  try {
    await AuthApiService.refresh()
    router.push('/user')
  } catch (e) {
    router.push('/login')
  }
}

</script>

<style lang="sass" scoped>
.main-header
  width: 100%
  max-width: 500px
  @media (max-width: 400px)
    flex-direction: column

.main-page-img
  max-width: 600px
  max-height: 50vh
</style>