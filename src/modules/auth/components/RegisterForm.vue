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
        :rules="[ val => val && val.length > 0 || t('ENTER_EMAIL')]"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        :label="t('PASSWORD')"
        lazy-rules
        :rules="[ val => val && val.length >= 6 || t('MIN_PASSWORD') ]"
      />

      <q-toggle v-model="accept" :label="t('ACCEPT_AGREEMENTS')" />

      <div class="flex justify-center">
        <q-btn :label="t('CREATE_ACCOUNT')" type="submit" color="primary" class="text-bold" />
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
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

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
      message: t('NEED_ACCEPT')
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
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
</style>
