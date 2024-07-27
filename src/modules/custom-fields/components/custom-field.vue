<template>
  <div class="user-wrapper">
    <div class="q-pa-sm q-mb-sm text-h5 text-weight-bold">{{ t('USER') }}</div>
    <q-form
      @submit="onSubmit"
      class="user-form"
    >
      <q-input
        bottom-slots
        v-model="userName"
        :label="t('ENTER_FULL_NAME')"
        :rules="[ val => val && val.length > 0 ]"
        :dense="true"
      >
        <template v-slot:append>
          <q-icon name="close" @click="userName = ''" class="cursor-pointer" color="primary" />
        </template>
      </q-input>

      <q-input
        bottom-slots
        v-model="profileName"
        :label="t('ENTER_PROFILE_NAME')"
        :rules="[ val => val && val.length > 0 ]"
        :dense="true"
      >
        <template v-slot:append>
          <q-icon name="close" @click="profileName = ''" class="cursor-pointer" color="primary" />
        </template>
      </q-input>

      <q-select
        v-model="lang"
        :options="LANG_OPTIONS"
        class="issues-filter q-mb-lg"
        :label="t('LANGUAGE')"
        :dense="true"
        input-style="{font-weight: bold }"
      />

      <q-input v-model="email" hint="Email" readonly :dense="true" />
      <q-input v-model="createdAt" :hint="t('REGISTRATION_DATE')" readonly :dense="true" />

      <q-btn :label="t('SAVE')" type="submit" color="primary" class="text-bold q-mt-lg" :disable="!isChanged"/>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { UsersApiService } from 'src/modules/users/services'
import { date } from 'quasar'
import { useRoute } from 'vue-router'
import { useUsersStore } from 'src/modules/users/users-store'
import { TProfileLanguage } from '../services/users-api.interface'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const { locale } = useI18n({ useScope: 'global' })

const route = useRoute()

const usersStore = useUsersStore()
usersStore.getUser(route.params.id as string)

const $q = useQuasar()

const user = computed(() => usersStore.user)
const me = computed(() => usersStore.me)

const userName = ref('')
const profileName = ref('')
const lang = ref({ value: 'en-US', label: 'English' })
const email = ref('')
const createdAt = ref('')

const LANG_OPTIONS = [
  {
    value: 'en-US',
    label: 'English'
  },
  {
    value: 'ru',
    label: 'Русский'
  }
]

const isChanged = computed(() => {
  return userName.value !== user.value?.user_name ||
        profileName.value !== user.value?.profile_name ||
        lang.value.value !== user.value?.lang
})

function setUserInfo () {
  userName.value = user.value?.user_name || ''
  profileName.value = user.value?.profile_name || ''
  lang.value = user.value?.lang === 'en-US' ? LANG_OPTIONS[0] : LANG_OPTIONS[1]
  email.value = user.value?.email || ''
  createdAt.value = date.formatDate(user.value?.createdAt, 'D MMM YYYY HH:mm:ss')

  if (me.value?.user_id === user.value?.user_id) {
    localStorage.setItem('userLocale', user.value?.lang ?? 'en-US')
    locale.value = user.value?.lang ?? 'en-US'
  }
}

watch(() => user.value, () => {
  setUserInfo()
})

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    usersStore.user = await UsersApiService.updateUser({
      user_name: userName.value,
      profile_name: profileName.value,
      lang: lang.value.value as TProfileLanguage,
      user_id: user.value?.user_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('CHANGES_SAVED')
    })
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
.user-wrapper
  width: 100%
.user-form:deep
  width: 300px
  max-width: 100%
  & input,
  & textarea
    font-weight: bold
</style>
