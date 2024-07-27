<template>
  <div class="login-wrapper q-pa-xl shadow-1 column flex justify-center text-center">
    <a href="/"><img class="logo q-mb-md" src="~assets/logo.svg" alt=""></a>
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="email"
        label="Email"
        :rules="[ val => val && val.length > 0 || t('ENTER_EMAIL')]"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        :label="t('PASSWORD')"
        :rules="[ val => val && val.length > 0 || t('ENTER_PASSWORD')]"
      />

      <div class="flex justify-center">
        <q-btn :label="t('SIGN_IN')" type="submit" color="primary" class="text-bold"/>
      </div>
    </q-form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import { AuthApiService } from 'src/modules/auth/services'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const $q = useQuasar()
const router = useRouter()

const email = ref(null)
const password = ref(null)

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    if (!email.value || !password.value) return
    await AuthApiService.login({ email: email.value, password: password.value })
    router.push('/projects')
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

</script>

<style lang="sass" scoped>
.login-wrapper
  max-width: 400px
  width: 100%
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
</style>
