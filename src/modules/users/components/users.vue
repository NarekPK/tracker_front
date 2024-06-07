<template>
  <div class="users-wrapper">
    <div class="users-title q-mb-lg text-h5 text-weight-bold">{{ `${t('USERS')}: ${users.length}` }}</div>
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
      :rows-per-page-options="[10]"
    >
      <template v-slot:body-cell-profile_name="props">
        <q-td :props="props">
          <router-link
            :to="`/user/${props.row.user_id}`"
            color="primary"
            class="users-link text-subtitle1"
          >
            {{ props.row.profile_name }}
          </router-link>
        </q-td>
      </template>
    </q-table>

    <q-btn
      :label="t('NEW_USER')"
      color="primary"
      class="text-bold q-mt-md q-mr-md"
      rounded
      @click="showNewUserDialog = true"
    />
    <q-btn
      v-if="selected.length"
      :label="t('DELETE_USER')"
      class="text-bold q-mt-md"
      rounded
      @click="showDeleteUserDialog = true"
    />

    <q-dialog v-model="showNewUserDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_USER') }}</div>
        <q-form
          @submit="onAddUserSubmit"
          class="new-user-form"
        >
          <q-input
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || t('ENTER_EMAIL') ]"
            bottom-slots
          />

          <q-input
            type="password"
            v-model="password"
            :label="t('PASSWORD')"
            lazy-rules
            :rules="[ val => val && val.length >= 6 || t('MIN_PASSWORD') ]"
          />

          <q-input
            type="password"
            v-model="confirmationPassword"
            :label="t('CONFIRM_PASSWORD')"
            lazy-rules
            :rules="[ val => val && val.length >= 6 || t('MIN_PASSWORD') ]"
          />

          <div class="flex q-mt-lg">
            <q-btn :label="t('CREATE')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteUserDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_USER') }}?</div>
        <i18n-t
          :keypath="'DELETE_USER_WARNING.text'"
          tag="div"
        >
          <template v-slot:selected>
            <b>{{ selected[0].profile_name }}</b>
          </template>
        </i18n-t>
        <q-form
          @submit="onDeleteUserSubmit"
          class="delete-user-form"
        >
          <div class="flex q-mt-lg">
            <q-btn :label="t('DELETE')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { UsersApiService } from 'src/modules/users/services'
import { IUser } from 'src/modules/users/services/users-api.interface'
import { date } from 'quasar'
import { useUsersStore } from 'src/modules/users/users-store'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const usersStore = useUsersStore()

const $q = useQuasar()

const selected = ref<IUser[]>([])

let columns = ref([
  {
    name: 'user_name',
    required: true,
    label: t('FULL_NAME'),
    align: 'left',
    field: (user: IUser) => user.user_name,
    sortable: true
  },
  { name: 'profile_name', align: 'left', label: t('PROFILE_NAME'), field: (user: IUser) => user.profile_name, sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'createdAt', align: 'left', label: t('REGISTRATION_DATE'), field: 'createdAt', format: (val: string) => date.formatDate(val, 'D MMM YYYY HH:mm:ss'), }
])

usersStore.getAllUsers()
const users = computed(() => usersStore.users)
const me = computed(() => usersStore.me)

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
      message: t('PASSWORDS_MATCH')
    })
  }
  else {
    try {
      if (!email.value || !password.value || !confirmationPassword.value) return
      await UsersApiService.createUser({
        email: email.value,
        password: password.value,
        confirmation_password: confirmationPassword.value,
        workspace_id: me.value?.workspace_id
      })
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'check_circle',
        message: t('USER_DELETED')
      })
      usersStore.getAllUsers()
    } catch (e) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: e.message
      })
    }
  }

  showNewUserDialog.value = false
  clearAddUserInfo()
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
      message: t('USER_DELETED')
    })
    usersStore.getAllUsers()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  selected.value = []
  showDeleteUserDialog.value = false
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
.new-user-form
  width: 300px
  max-width: 100%
  &:deep
    & input,
    & textarea
      font-weight: bold
.users-link
  text-decoration: none
  display: flex
  align-items: center
  height: 100%
</style>
