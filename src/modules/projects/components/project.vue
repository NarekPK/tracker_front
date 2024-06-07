<template>
  <div class="project-wrapper">
    <div class="project-title q-mb-lg text-h5 text-weight-bold">{{ t('PROJECT') }}</div>
    <div class="form-wrapper">
      <q-form
        @submit="onSubmit"
        class="project-form q-mb-lg"
      >
        <q-input
          bottom-slots
          v-model="projectName"
          :label="t('NAME')"
          :rules="[ val => val && val.length > 0 || t('ENTER_NAME')]"
          filled
        />
        <q-input
          bottom-slots
          v-model="projectDescription"
          :label="t('DESCRIPTION')"
          filled
          type="textarea"
          autogrow
        />
        <q-select filled v-model="projectOwner" :options="usersOptions" :label="t('PROJECT_OWNER')" />
        <q-btn v-if="isChanged" :label="t('SAVE')" type="submit" color="primary text-bold q-mt-lg q-mb-lg" />
      </q-form>
    </div>
    <div class="project-title q-mb-lg text-h5 text-weight-bold">{{ t('PROJECT_ACCESSES') }}</div>
    <div class="project-controls q-mb-md">
      <div class="project-controls__buttons">
        <q-btn :label="t('GRANT_ROLE')" color="primary" class="text-bold q-mr-md" rounded @click="showNewProjectRoleDialog = true" />
        <q-btn v-if="showDeleteProjectRoleBtn" :label="t('REVOKE_ROLE')" class="text-bold" rounded @click="showDeleteProjectRoleDialog = true" />
      </div>
      <!-- <div class="project-controls__filters">
        <div class="q-pa-sm text-subtitle1">Посмотреть по:
          <q-btn-group>
            <q-btn
              :color="getButtonColor('user')"
              :textColor="getTextColor('user')"
              label="Пользователь"
              class="text-bold"
              @click="rolesFilter = 'user'"
            />
            <q-btn
              :color="getButtonColor('role')"
              :textColor="getTextColor('role')"
              label="Роль"
              class="text-bold"
              @click="rolesFilter = 'role'"
            />
          </q-btn-group>
        </div>
      </div> -->
    </div>

    <q-list v-for="item in localRoles" :key="item?.id" bordered class="q-mb-sm">
      <q-item v-ripple>
        <q-item-section class="project-user-wrapper">
          <q-item-section side top>
            <q-checkbox v-model="item.isActive" @update:model-value="updateUserRolesChecks(item, 'user')" />
          </q-item-section>
          <q-item-label class="items-start">
            <span>{{ t('USER') }}&nbsp;</span>
            <router-link
              class="text-subtitle1 text-weight-bold project-user-link"
              :to="`/user/${item.user.user_id}`"
              target="_blank"
            >
              {{ item.user.profile_name }}
            </router-link>
          </q-item-label>
        </q-item-section>
        <q-item-section class="justify-start">
          <q-item-label>
            <div class="text-weight-bold q-pa-sm">{{ t('ROLE') }}</div>
            <div
              v-for="r in item.roles"
              :key="r.role_id"
              class="flex"
            >
              <q-item-section side top>
                <q-checkbox v-model="r.isActive" @update:model-value="updateUserRolesChecks(item, 'role')" />
              </q-item-section>
              <router-link
                class="text-subtitle1 text-weight-bold project-role-link"
                :to="`/role/${r.role_id}`"
                target="_blank"
              >
                {{ getRoleName(r.name) }}
              </router-link>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showNewProjectRoleDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">{{ t('GRANT_ROLE') }}</div>
        <q-form
          @submit="onAddProjectRoleSubmit"
          class="new-role-form"
        >
          <q-select filled v-model="roleToProvide" :options="rolesOptions" class="q-mb-lg" :label="t('SELECT_ROLE')" />

          <q-select filled v-model="userToProvide" :options="usersOptions" :label="t('SELECT_USER')" />

          <div class="flex q-mt-lg">
            <q-btn :label="t('GRANT')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteProjectRoleDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('REVOKE_ROLE') }}</div>
        <div
          v-for="item in selectedUsersRoles"
          :key="item?.id"
          class="q-mb-md"
        >
          <i18n-t
            :keypath="'DELETE_USER_ROLE_WARNING.text'"
            tag="div"
            class="q-mb-sm"
          >
            <template v-slot:selected>
              <b>{{ item.user.profile_name }}</b>
            </template>
          </i18n-t>
          <div
            class="text-bold q-ml-lg"
            v-for="role in item.roles.filter(r=> r.isActive)" :key="role.role_id"
          >
            - {{ getRoleName(role.name) }}
          </div>
        </div>
        <q-form
          @submit="onDeleteProjectRoleSubmit"
          class="new-role-form"
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
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { ProjectsApiService } from 'src/modules/projects/services'
import { useProjectsStore } from 'src/modules/projects/projects-store'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRoute } from 'vue-router'
import { useRolesStore } from 'src/modules/roles/roles-store'
import { IProjectUserRole } from 'src/modules/projects/services/projects-api.interface'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()


const route = useRoute()
const projectsStore = useProjectsStore()
projectsStore.getProject(route.params.id as string)

const usersStore = useUsersStore()
const usersOptions = computed(() => usersStore.users.map(u => {
  return { value: u.user_id, label: u.profile_name } as TUserOption
}))

const $q = useQuasar()

const project = computed(() => projectsStore.project)

const projectName = ref('')
const projectDescription = ref<string | null>(null)

type TUserOption = { value: string, label: string }
const projectOwner = ref<TUserOption | null>(null)

const isChanged = computed(() => {
  return projectName.value !== project.value?.name ||
    projectDescription.value !== project.value?.description ||
    projectOwner.value?.label !== usersOptions.value.find(o => o.value === project.value?.project_owner)?.label
})

watch(() => project.value, async () => {
  await usersStore.getAllUsers()
  projectName.value = project.value?.name || ''
  projectDescription.value = project.value?.description || null
  projectOwner.value = usersOptions.value.find(u => u.value === project.value?.project_owner) || null
})

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    projectsStore.project = await ProjectsApiService.updateProject({
      name: projectName.value,
      description: projectDescription.value,
      project_owner: projectOwner.value?.value,
      project_id: project.value?.project_id
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

const rolesStore = useRolesStore()
rolesStore.getAllRoles()

type TRoleOption = { value: string, label: string }
const roleToProvide = ref<TRoleOption | null>(null)
const rolesOptions = computed(() => rolesStore.roles.map(r => {
  return { value: r.role_id, label: getRoleName(r.name ?? '') } as TRoleOption
}))

const userToProvide = ref<TUserOption | null>(null)

const showNewProjectRoleDialog = ref(false)

async function onAddProjectRoleSubmit () {
  if (!userToProvide.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('SELECT_USER_FOR_ROLE')
    })
  } else if (!roleToProvide.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('SELECT_ROLE_FOR_USER')
    })
  } else {
  try {
      await ProjectsApiService.addProjectRole({
        project_id: project.value?.project_id,
        role_id: roleToProvide.value?.value,
        user_id: userToProvide.value?.value
      })
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'check_circle',
        message: t('ROLE_GRANTED')
      })
      projectsStore.getProjectRoles(route.params.id as string)
    } catch (e) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: e.message
      })
    }

    showNewProjectRoleDialog.value = false
    roleToProvide.value = null
    userToProvide.value = null
  }
}

// type TRolesFilters = 'user' | 'role'

const projectRoles = computed(() => projectsStore.projectRoles)
const localRoles = ref<IProjectUserRole[]>([])
const selectedUsersRoles = computed(() => localRoles.value.filter(i => i.roles.some(r => r.isActive)))

// const rolesFilter = ref<TRolesFilters>('user')

const showDeleteProjectRoleBtn = computed(() => localRoles.value.some(i => i.isActive) || localRoles.value.some(i => i.roles.some(r => r.isActive)))
const showDeleteProjectRoleDialog = ref(false)

projectsStore.getProjectRoles(route.params.id as string)

function refreshLocalRoles (val: IProjectUserRole[]) {
  localRoles.value = val.filter(i => i.roles.length).map((item: IProjectUserRole) => {
    item.roles = item.roles.map(r => {
      return { ...r, isActive: false }
    })
    return {
      ...item,
      isActive: false
    }
  })
}

watch(() => projectRoles.value, async (val) => {
  refreshLocalRoles(val)
})

function updateUserRolesChecks (item: IProjectUserRole, type: 'user' | 'role') {
  if (type === 'user') {
    item.roles = item.roles.map(r => {
      return { ...r, isActive: item.isActive }
    })
  } else {
    item.isActive = item.roles.every(r => r.isActive)
  }
}

async function onDeleteProjectRoleSubmit () {
  const selectedUsersPrepared = localRoles.value
    .filter(i => i.roles.some(r => r.isActive))
    .map(i => {
      return {
        id: i.id,
        project_id: i.project_id,
        roles: i.roles.filter(r => r.isActive).map(r => {
          return  {
            name: r.name,
            role_id: r.role_id
          }
        }),
        user: {...i.user}
      }
    })
  try {
    await ProjectsApiService.deleteProjectRoles(selectedUsersPrepared)
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ROLE_DELETED')
    })
    await projectsStore.getProjectRoles(route.params.id as string)
  } catch (e) {
    refreshLocalRoles(localRoles.value)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  showDeleteProjectRoleDialog.value = false
}

function getRoleName (name: string) {
  return (name?.startsWith('RN_') ? t(name) : name) || ''
}

// function getButtonColor (type: TRolesFilters) {
//   return rolesFilter.value === type ? 'primary' : ''
// }

// function getTextColor (type: TRolesFilters) {
//   return rolesFilter.value === type ? 'white' : 'black'
// }

</script>

<style lang="sass" scoped>
.project-wrapper
  width: 100%
.form-wrapper
  width: 100%
  max-width: 350px
.project-form:deep
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
.project-controls
  display: flex
  justify-content: space-between
  align-items: center
.project-user-wrapper
  flex-direction: row
  justify-content: start
  align-items: center
.project-user-link
  text-decoration: none
  color: $primary
  &:hover
    color: black
.project-role-link
  text-decoration: none
  color: $primary
  display: flex
  align-items: center
  &:hover
    color: black
</style>
