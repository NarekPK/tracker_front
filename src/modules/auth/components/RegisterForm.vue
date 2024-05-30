<template>
  <div class="reg-wrapper q-pa-xl shadow-1 flex justify-center">
    <a href="/"><img class="logo q-mb-md" src="~assets/logo.svg" alt=""></a>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
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
        lazy-rules
        :rules="[
          val => val && val.length >= 6 || 'Пароль должен быть длиннее 6 символов'
        ]"
      />

      <q-toggle v-model="accept" label="Я принимаю лицензионные условия и соглашения" />

      <div class="flex justify-center">
        <q-btn label="Зарегистрироваться" type="submit" color="primary" class="text-bold" />
        <!-- <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" /> -->
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
const accept = ref(false)

async function onSubmit () {
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Сначала необходимо принять лицензионные условия и соглашения'
    })
  }
  else {
    try {
      if (!email.value || !password.value) return
      await AuthApiService.register({ email: email.value, password: password.value })
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
}

function onReset () {
  email.value = null
  password.value = null
  accept.value = false
}

</script>

<style lang="sass" scoped>
.reg-wrapper
  max-width: 400px
  width: 100%
  border: 1px solid #1976D2
  border-radius: 16px
</style>