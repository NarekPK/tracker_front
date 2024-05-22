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
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Введите email']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Пароль"
      />

      <div class="flex justify-center">
        <q-btn label="Войти" type="submit" color="primary" class="text-bold"/>
      </div>
    </q-form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import { AuthApiService } from 'src/modules/auth/services'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const email = ref(null)
const password = ref(null)

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    if (!email.value || !password.value) return
    await AuthApiService.login({ email: email.value, password: password.value })
    router.push('/user')
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
  border: 1px solid #1976D2
  border-radius: 16px
</style>