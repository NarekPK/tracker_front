<template>
  <div class="role-wrapper">
    <div class="role-title q-mb-lg text-h5 text-weight-bold">{{ t('ROLE') }}</div>
    <q-form
      @submit="onSubmit"
      class="role-form"
    >
      <q-input
        bottom-slots
        v-model="roleName"
        :label="t('NAME')"
        :rules="[ val => val && val.length > 0 || t('ENTER_ROLE_NAME') ]"
        filled
      />

      <q-input
        bottom-slots
        v-model="roleDescription"
        :label="t('DESCRIPTION')"
        filled
        type="textarea"
        autogrow
      />

      <q-btn v-if="isChanged" :label="t('SAVE')" type="submit" color="primary" class="text-bold q-mb-xl" />
    </q-form>
    <div class="q-pa-sm q-mb-sm text-h5 text-weight-bold">{{ t('PERMISSIONS') }}</div>
    <div class="q-pa-sm q-mb-sm text-subtitle1">
      <span class="q-mr-md">{{ t('GROUP_BY') }}:</span>
      <q-btn-group>
        <q-btn
          :color="getButtonColor('entity_type')"
          :textColor="getTextColor('entity_type')"
          :label="t('ENTITY')"
          class="text-bold"
          @click="permissionsFilter = 'entity_type'"
        />
        <q-btn
          :color="getButtonColor('operation')"
          :textColor="getTextColor('operation')"
          :label="t('OPERATION')"
          class="text-bold"
          @click="permissionsFilter = 'operation'"
        />
      </q-btn-group>
    </div>
    <div v-if="role">
      <q-list v-for="group in filterGroups" :key="group" bordered class="q-mb-sm">
        <q-toolbar class="bg-primary text-white shadow-1">
          <q-toolbar-title>{{ t(group) }}</q-toolbar-title>
        </q-toolbar>
        <q-item
          v-for="p in localBasePermissions.filter(p => p[permissionsFilter] === group)"
          :key="p.permission_key"
          tag="label"
          v-ripple
        >
          <q-item-section side top>
            <q-checkbox v-model="p.isActive" @update:model-value="updatePermissions(p)" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ t(p.name) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { useQuasar } from 'quasar'
import { RolesApiService } from 'src/modules/roles/services'
import { useRolesStore } from 'src/modules/roles/roles-store'
import { useRoute } from 'vue-router'
import { IPermission } from 'src/modules/roles/services/roles-api.interface'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const route = useRoute()
const rolesStore = useRolesStore()

rolesStore.getRole(route.params.id as string)

const $q = useQuasar()

type TPermissionFilters = 'entity_type' | 'operation'
const localBasePermissions = ref<IPermission[]>(structuredClone(toRaw(rolesStore.basePermissions)))
const permissionsFilter = ref<TPermissionFilters>('entity_type')
const filterGroups = computed(() => [...new Set(localBasePermissions.value.map(p => p[permissionsFilter.value]))])

const role = computed(() => rolesStore.role)

const roleName = ref('')
const roleDescription = ref('')

const isChanged = computed(() => roleName.value !== role.value?.name || roleDescription.value !== role.value?.description)

watch(() => role.value, () => {
  roleName.value = (role.value?.name?.startsWith('RN_') ? t(role.value?.name) : role.value?.name) || ''
  roleDescription.value = (role.value?.description?.startsWith('RD_') ? t(role.value?.description) : role.value?.description) || ''
  localBasePermissions.value = localBasePermissions.value.map(p => {
    return {
      ...p,
      isActive: role.value?.permissions?.includes(p.permission_key)
    }
  })
})

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    rolesStore.role = await RolesApiService.updateRole(
      role.value?.role_id as string,
      {
        name: roleName.value,
        description: roleDescription.value
      }
    )
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

async function updatePermissions (permission: IPermission) {
  const newPermissions = permission.isActive ?
    [ ...new Set([...(role.value?.permissions || []), permission.permission_key, ...(permission?.implied_permissions?.map(p => p.permission_key) || []) ])] :
    role.value?.permissions?.filter(p => p !== permission.permission_key && (permission?.dependent_permissions ? permission?.dependent_permissions?.every(d => d.permission_key !== p) : true))

  rolesStore.role = await RolesApiService.updateRole(
    role.value?.role_id as string,
    {
      permissions: newPermissions,
      role_id: role.value?.role_id
    }
  )
}

function getButtonColor (type: TPermissionFilters) {
  return permissionsFilter.value === type ? 'primary' : ''
}

function getTextColor (type: TPermissionFilters) {
  return permissionsFilter.value === type ? 'white' : 'black'
}

</script>

<style lang="sass" scoped>
.role-form
  width: 450px
  max-width: 100%
  &:deep
    & input,
    & textarea
      font-weight: bold
.permissions-table:deep
  .permissions-table-header
    background: $primary
    color: #fff
  th
    font-weight: 700
  tbody
    font-weight: 500
</style>
