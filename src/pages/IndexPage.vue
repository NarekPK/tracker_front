<template>
  <q-page class="column items-center justify-center">
    <div class="main-page flex column q-pa-xl">
      <div class="main-header">
        <img class="logo q-mb-md" src="~assets/logo.svg" alt="">
        <div class="auth-buttons q-mb-md">
          <q-btn @click="handleLogin" :label="t('SIGN_IN')" class="text-bold"/>
          <q-btn href="/register" :label="t('CREATE_ACCOUNT')" type="submit" color="primary" class="text-bold"/>
        </div>
        <!-- <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" /> -->
      </div>

      <img class="main-page-img" src="~assets/main-page-pic.svg" alt="">
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { AuthApiService } from 'src/modules/auth/services'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const router = useRouter()

defineOptions({
  name: 'IndexPage'
})

async function handleLogin () {
  try {
    await AuthApiService.refresh()
    router.push('/projects')
  } catch (e) {
    router.push('/login')
  }
}

</script>

<style lang="sass" scoped>
.main-page
  max-width: 600px
  width: 100%
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
.main-header
  display: flex
  width: 100%
  max-width: 500px
  justify-content: center
  flex-direction: column
  align-items: center
  @media (min-width: 500px)
    flex-direction: row
    justify-content: space-between
.auth-buttons
  display: flex
  gap: 16px
.main-page-img
  max-width: 600px
  max-height: 50vh
</style>
