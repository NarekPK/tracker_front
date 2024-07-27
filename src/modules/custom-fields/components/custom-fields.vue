<template>
  <div class="custom-fields-wrapper">
    <div class="custom-fields-title q-mb-lg text-h5 text-weight-bold">{{ t('CUSTOM_FIELDS') }}</div>
    <q-btn
      :label="t('NEW_CUSTOM_FIELD')"
      color="primary"
      class="text-bold q-mb-md q-mr-md"
      rounded
      @click="showNewFieldDialog = true"
    />
    <q-btn
      v-if="selected.length"
      :label="t('EDIT_CUSTOM_FIELD')"
      class="text-bold q-mb-md q-mr-md"
      rounded
      @click="showEditFieldDialog = true"
    />
    <q-btn
      v-if="selected.length"
      :label="t('DELETE_CUSTOM_FIELD')"
      class="text-bold q-mb-md"
      rounded
      @click="showDeleteFieldDialog = true"
    />
    <q-table
      flat
      :rows="customFields"
      :columns="columns"
      row-key="custom_field_id"
      selection="single"
      v-model:selected="selected"
      title-class="primary"
      color="primary"
      class="custom-fields-table"
      table-header-class="custom-fields-table-header"
      :rows-per-page-options="[10]"
    >
      <template v-slot:body-cell-profile_name="props">
        <q-td :props="props">
          <router-link
            :to="`/custom-field/${props.row.custom_field_id}`"
            color="primary"
            class="custom-fields-link text-subtitle1"
          >
            {{ props.row.profile_name }}
          </router-link>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showNewFieldDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_USER') }}</div>
        <q-form
          @submit="onAddFieldSubmit"
          class="new-custom-field-form"
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

    <q-dialog v-model="showEditFieldDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_USER') }}</div>
        <q-form
          @submit="onAddFieldSubmit"
          class="new-custom-field-form"
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

    <q-dialog v-model="showDeleteFieldDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_CUSTOM_FIELD') }}?</div>
        <i18n-t
          :keypath="'DELETE_CUSTOM_FIELD_WARNING.text'"
          tag="div"
        >
          <template v-slot:selected>
            <b>{{ selected[0].key ? t(selected[0].name) : selected[0].name }}</b>
          </template>
        </i18n-t>
        <q-form
          @submit="onDeleteFieldSubmit"
          class="delete-custom-field-form"
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { CustomFieldsApiService } from 'src/modules/custom-fields/services'
import { ICustomField } from 'src/modules/custom-fields/services/custom-fields-api.interface'
// import { date } from 'quasar'
// import { useUsersStore } from 'src/modules/custom-fields/custom-fields-store'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

// const usersStore = useUsersStore()

const $q = useQuasar()

const customFields = ref<ICustomField[]>([])

getAllCustomFields()

async function getAllCustomFields () {
  customFields.value = await CustomFieldsApiService.getAllCustomFields()
}

const selected = ref<ICustomField[]>([])

let columns = ref([
  {
    name: 'name',
    required: true,
    label: t('NAME'),
    align: 'left',
    field: (customField: ICustomField) => customField.key ? t(customField.name) : customField.name,
    sortable: true
  },
  {
    name: 'field_type',
    align: 'left',
    label: t('CF_TYPE'),
    field: (customField: ICustomField) => t(`CFT_${customField.field_type.toUpperCase()}`)
  },
  {
    name: 'default_value',
    align: 'left',
    label: t('DEFAULT_VALUE'),
    field: (customField: ICustomField) => {
      if (customField.key) {
        return customField.default_value ? t(customField.default_value) : t('NO_VALUE')
      } else {
        return customField.default_value ? customField.default_value : t('NO_VALUE')
      }
    },
  },
  {
    name: 'empty_value',
    align: 'left',
    label: t('EMPTY_VALUE'),
    field: (customField: ICustomField) => {
      if (customField.key) {
        return customField.empty_value ? t(customField.empty_value) : t('NO_VALUE')
      } else {
        return customField.empty_value ? customField.empty_value : t('NO_VALUE')
      }
    },
  }
])

/* usersStore.getAllUsers()
const users = computed(() => usersStore.users)
const me = computed(() => usersStore.me) */

const showNewFieldDialog = ref(false)

async function onAddFieldSubmit () {
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
      // usersStore.getAllUsers()
    } catch (e) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: e.message
      })
    }
  }

  showNewFieldDialog.value = false
  clearAddUserInfo()
}

function clearAddUserInfo () {
  // email.value = null
  // password.value = null
  // confirmationPassword.value = null
}

const showEditFieldDialog = ref(false)

const showDeleteFieldDialog = ref(false)

async function onDeleteFieldSubmit () {
  try {
    if (!selected.value[0]?.custom_field_id) return
    await CustomFieldsApiService.deleteCustomField({ custom_field_id: selected.value[0].custom_field_id })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('USER_DELETED')
    })
    getAllCustomFields()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  selected.value = []
  showDeleteFieldDialog.value = false
}

</script>

<style lang="sass" scoped>
.custom-fields-wrapper
  width: 100%
.custom-fields-table:deep
  .custom-fields-table-header
    background: $primary
    color: #fff
  th
    font-weight: 700
  tbody
    font-weight: 500
.new-custom-field-form
  width: 300px
  max-width: 100%
  &:deep
    & input,
    & textarea
      font-weight: bold
.custom-fields-link
  text-decoration: none
  display: flex
  align-items: center
  height: 100%
</style>
