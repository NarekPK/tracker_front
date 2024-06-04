<template>
  <div class="user-wrapper">
    <div class="q-pa-sm q-mb-sm text-h5 text-weight-bold">Пользователь</div>
    <q-form
      @submit="onSubmit"
      class="user-form"
    >
      <q-input
        bottom-slots
        v-model="userName"
        label="Введите имя и фамилию"
        :rules="[ val => val && val.length > 0 ]"
        filled
      >
        <template v-slot:append>
          <q-icon name="close" @click="userName = ''" class="cursor-pointer" color="primary" />
        </template>
      </q-input>

      <q-input
        bottom-slots
        v-model="profileName"
        label="Введите имя профиля"
        filled
        :rules="[ val => val && val.length > 0 ]"
      >
        <template v-slot:append>
          <q-icon name="close" @click="profileName = ''" class="cursor-pointer" color="primary" />
        </template>
      </q-input>

      <q-input v-model="email" hint="Электронная почта" readonly filled />
      <q-input v-model="createdAt" hint="Дата регистрации" readonly filled />

      <q-btn label="Сохранить" type="submit" color="primary text-bold q-mt-xl" :disable="!isChanged"/>
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

const route = useRoute()

const usersStore = useUsersStore()
usersStore.getUser(route.params.id as string)

const $q = useQuasar()

const user = computed(() => usersStore.user)

const userName = ref('')
const profileName = ref('')
const email = ref('')
const createdAt = ref('')

const isChanged = computed(() => userName.value !== user.value?.user_name || profileName.value !== user.value?.profile_name)

function setUserInfo () {
  userName.value = user.value?.user_name || ''
  profileName.value = user.value?.profile_name || ''
  email.value = user.value?.email || ''
  createdAt.value = date.formatDate(user.value?.createdAt, 'D MMM YYYYг. HH:mm:ss')
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
      user_id: user.value?.user_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Изменения сохранены'
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