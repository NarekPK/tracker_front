<template>
  <div class="roles-wrapper">
    <div class="roles-title q-mb-lg text-h5 text-weight-bold">{{ `Ролей: ${roles.length}` }}</div>
    <q-table
      flat
      :rows="roles"
      :columns="columns"
      row-key="name"
      selection="single"
      v-model:selected="selected"
      title-class="primary"
      color="primary"
      class="roles-table"
      table-header-class="roles-table-header"
      :rows-per-page-options="[10]"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="`/role/${props.row.role_id}`"
            color="primary"
            class="roles-link text-subtitle1"
          >
              {{ props.row.name }}
          </router-link>
        </q-td>
      </template>
    </q-table>

    <q-btn label="Новая роль" color="primary" class="text-bold q-mt-md q-mr-md" rounded @click="showNewRoleDialog = true" />
    <q-btn v-if="selected.length" label="Удалить роль" class="text-bold q-mt-md" rounded @click="showDeleteRoleDialog = true" />

    <q-dialog v-model="showNewRoleDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">Создание новой роли</div>
        <q-form
          @submit="onAddRoleSubmit"
          class="new-role-form"
        >
          <q-input
            bottom-slots
            v-model="roleName"
            label="Имя"
            :rules="[ val => val && val.length > 0 ]"
            filled
          />

          <q-input
            bottom-slots
            v-model="roleDescription"
            label="Описание"
            filled
            type="textarea"
            autogrow
          />


          <div class="flex q-mt-lg">
            <q-btn label="Создать" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn label="Отмена" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteRoleDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Удалить роль?</div>
        После подтверждения этого действия роль <b>{{selected[0].name}}</b> будет удалена.
        <q-form
          @submit="onDeleteRoleSubmit"
          class="new-role-form"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { RolesApiService } from 'src/modules/roles/services'
import { IRole } from 'src/modules/roles/services/roles-api.interface'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRolesStore } from 'src/modules/roles/roles-store'
import { useRouter } from 'vue-router'

const usersStore = useUsersStore()
const rolesStore = useRolesStore()
const router = useRouter()

const $q = useQuasar()

const roles = computed(() => rolesStore.roles)

const selected = ref<IRole[]>([])

let columns = ref([
  {
    name: 'name',
    required: true,
    label: 'Имя и фамилия',
    align: 'left',
    field: (role: IRole) => role.name,
    sortable: true
  },
  { name: 'permissions', align: 'left', label: 'Разрешения', field: 'permissions', format: (val: string) => val.length, sortable: true }
])

rolesStore.getAllRoles()

const roleName = ref('')
const roleDescription = ref(null)

const showNewRoleDialog = ref(false)

async function onAddRoleSubmit () {
  try {
    if (!roleName.value) return
    const newRole = await RolesApiService.createRole({
      name: roleName.value,
      description: roleDescription.value,
      permissions: [],
      workspace_id: usersStore.me?.workspace_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Роль создана'
    })
    router.push(`/role/${newRole.role_id}`)
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const showDeleteRoleDialog = ref(false)

async function onDeleteRoleSubmit () {
  try {
    if (!selected.value[0]?.role_id) return
    await RolesApiService.deleteRole({ role_id: selected.value[0].role_id })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Роль удалена'
    })
    rolesStore.getAllRoles()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  selected.value = []
  showDeleteRoleDialog.value = false
}

</script>

<style lang="sass" scoped>
.roles-wrapper
  width: 100%
.roles-table:deep
  .roles-table-header
    background: $primary
    color: #fff
  th
    font-weight: 700
  tbody
    font-weight: 500
    tr td:nth-child(2)
      padding: 0
.new-role-form:deep
  & input,
  & textarea
    font-weight: bold
.roles-link
  text-decoration: none
  display: flex
  align-items: center
  height: 100%
.form-wrapper
  width: 100%
  max-width: 450px
</style>
