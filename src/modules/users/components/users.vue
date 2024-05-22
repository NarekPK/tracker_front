<template>
  <div class="users-wrapper">
    <div class="users-title q-pa-sm q-mb-sm text-h5 text-weight-bold">{{ `Пользователей: ${users.length}` }}</div>
    <q-table
      flat
      :rows="users"
      :columns="columns"
      row-key="user_name"
      selection="single"
      v-model:selected="selected"
      title-class="primary"
      color="primary"
      class="users-table"
      table-header-class="users-table-header"
    />

    <q-btn label="Новый пользователь" color="primary" class="text-bold q-mt-md q-mr-md" rounded @click="showNewUserDialog = true" />
    <q-btn v-if="selected.length" label="Удалить пользователя" class="text-bold q-mt-md" rounded @click="showDeleteUserDialog = true" />

    <q-dialog v-model="showNewUserDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Создание нового пользователя</div>
        <q-form
          @submit="onAddUserSubmit"
          class="new-user-form"
        >
          <q-input
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Введите email']"
            bottom-slots
          />

          <q-input
            type="password"
            v-model="password"
            label="Пароль"
            lazy-rules
            :rules="[
              val => val && val.length >= 6 || 'Пароль должен быть длиннее 6 символов'
            ]"
          />

          <q-input
            type="password"
            v-model="confirmationPassword"
            label="Подтвердить пароль"
            lazy-rules
            :rules="[
              val => val && val.length >= 6 || 'Пароль должен быть длиннее 6 символов'
            ]"
          />

          <div class="flex q-mt-lg">
            <q-btn label="Создать" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn label="Отмена" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteUserDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Удалить пользователя?</div>
        <div v-html="`После подтверждения этого действия аккаунт <b>${selected[0].profile_name}</b> будет удален.`"></div>
        <q-form
          @submit="onDeleteUserSubmit"
          class="new-user-form"
        >
          <div class="flex q-mt-lg">
            <q-btn label="Удалить" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn label="Отмена" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { UsersApiService } from 'src/modules/users/services'
import { TUser } from 'src/modules/users/services/users-api.interface'
import { date } from 'quasar'
import { useUsersStore } from 'src/modules/users/users-store'

const usersStore = useUsersStore()

const $q = useQuasar()

let users = ref<TUser[]>([])

const selected = ref<TUser[]>([])

let columns = ref([
  {
    name: 'user_name',
    required: true,
    label: 'Имя и фамилия',
    align: 'left',
    field: (user: TUser) => user.user_name,
    sortable: true
  },
  { name: 'profile_name', align: 'left', label: 'Имя профиля', field: 'profile_name', sortable: true },
  { name: 'email', align: 'left', label: 'Электронная почта', field: 'email', sortable: true },
  { name: 'createdAt', align: 'left', label: 'Дата регистрации', field: 'createdAt', format: (val: string) => date.formatDate(val, 'D MMM YYYYг. HH:mm:ss'), }
])

async function getUsersInfo () {
  users.value = await UsersApiService.getAllUsers()
}

getUsersInfo()

const email = ref(null)
const password = ref(null)
const confirmationPassword = ref(null)

const showNewUserDialog = ref(false)

async function onAddUserSubmit () {
  if (password.value !== confirmationPassword.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Пароли должны совпадать'
    })
  }
  else {
    try {
      if (!email.value || !password.value || !confirmationPassword.value) return
      await UsersApiService.createUser({
        email: email.value,
        password: password.value,
        confirmation_password: confirmationPassword.value,
        workspace_id: usersStore.user?.workspace_id
      })
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'check_circle',
        message: 'Пользователь создан'
      })
      showNewUserDialog.value = false
      clearAddUserInfo()
      getUsersInfo()
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

function clearAddUserInfo () {
  email.value = null
  password.value = null
  confirmationPassword.value = null
}

const showDeleteUserDialog = ref(false)

async function onDeleteUserSubmit () {
  try {
    if (!selected.value[0]?.user_id) return
    await UsersApiService.deleteUser({ user_id: selected.value[0].user_id })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Пользователь удален'
    })
    selected.value = []
    showDeleteUserDialog.value = false
    getUsersInfo()
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
.users-wrapper
  width: 100%
.users-table:deep
  .users-table-header
    background: $primary
    color: #fff
  th
    font-weight: 700
  tbody
    font-weight: 500
.user-form:deep
  & input
    font-weight: bold
</style>