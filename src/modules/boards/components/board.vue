<template>
  <div class="board-wrapper">
    <div class="board-title q-mb-lg text-h5 text-weight-bold">{{ t('PROJECT') }}</div>
    <div class="form-wrapper">
      <q-form
        @submit="onSubmit"
        class="board-form q-mb-lg"
      >
        <q-input
          bottom-slots
          v-model="boardName"
          :label="t('NAME')"
          :rules="[ val => val && val.length > 0 || t('ENTER_NAME')]"
          filled
        />
        <q-input
          bottom-slots
          v-model="boardDescription"
          :label="t('DESCRIPTION')"
          filled
          type="textarea"
          autogrow
        />
        <q-select filled v-model="boardOwner" :options="usersOptions" :label="t('PROJECT_OWNER')" />
        <q-btn v-if="isChanged" :label="t('SAVE')" type="submit" color="primary text-bold q-mt-lg q-mb-lg" />
      </q-form>
    </div>
    <div class="board-title q-mb-lg text-h5 text-weight-bold">{{ t('PROJECT_ACCESSES') }}</div>
    <div class="board-controls q-mb-md">
      <div class="board-controls__buttons">
        <q-btn :label="t('GRANT_ROLE')" color="primary" class="text-bold q-mr-md" rounded @click="showNewBoardRoleDialog = true" />
        <q-btn v-if="showDeleteBoardRoleBtn" :label="t('REVOKE_ROLE')" class="text-bold" rounded @click="showDeleteBoardRoleDialog = true" />
      </div>
      <!-- <div class="board-controls__filters">
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
        <q-item-section class="board-user-wrapper">
          <q-item-section side top>
            <q-checkbox v-model="item.isActive" @update:model-value="updateUserRolesChecks(item, 'user')" />
          </q-item-section>
          <q-item-label class="items-start">
            <span>{{ t('USER') }}&nbsp;</span>
            <router-link
              class="text-subtitle1 text-weight-bold board-user-link"
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
                class="text-subtitle1 text-weight-bold board-role-link"
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

    <q-dialog v-model="showNewBoardRoleDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">{{ t('GRANT_ROLE') }}</div>
        <q-form
          @submit="onAddBoardRoleSubmit"
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

    <q-dialog v-model="showDeleteBoardRoleDialog">
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
          @submit="onDeleteBoardRoleSubmit"
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
import { BoardsApiService } from 'src/modules/boards/services'
import { useBoardsStore } from 'src/modules/boards/boards-store'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRoute } from 'vue-router'
import { useRolesStore } from 'src/modules/roles/roles-store'
// import { IBoardUserRole } from 'src/modules/boards/services/boards-api.interface'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()


const route = useRoute()
const boardsStore = useBoardsStore()
boardsStore.getBoard(route.params.id as string)

const usersStore = useUsersStore()
const usersOptions = computed(() => usersStore.users.map(u => {
  return { value: u.user_id, label: u.profile_name } as TUserOption
}))

const $q = useQuasar()

const board = computed(() => boardsStore.board)

const boardName = ref('')
const boardDescription = ref<string | null>(null)

type TUserOption = { value: string, label: string }
const boardOwner = ref<TUserOption | null>(null)

const isChanged = computed(() => {
  return boardName.value !== board.value?.name ||
    boardDescription.value !== board.value?.description ||
    // boardOwner.value?.label !== usersOptions.value.find(o => o.value === board.value?.board_owner)?.label
})

watch(() => board.value, async () => {
  await usersStore.getAllUsers()
  boardName.value = board.value?.name || ''
  boardDescription.value = board.value?.description || null
  // boardOwner.value = usersOptions.value.find(u => u.value === board.value?.board_owner) || null
})

async function onSubmit (event: Event) {
  event.preventDefault()
  try {
    boardsStore.board = await BoardsApiService.updateBoard(
      board.value?.board_id as string,
      {
        name: boardName.value,
        description: boardDescription.value,
        // board_owner: boardOwner.value?.value
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

const rolesStore = useRolesStore()
rolesStore.getAllRoles()

type TRoleOption = { value: string, label: string }
const roleToProvide = ref<TRoleOption | null>(null)
const rolesOptions = computed(() => rolesStore.roles.map(r => {
  return { value: r.role_id, label: getRoleName(r.name ?? '') } as TRoleOption
}))

const userToProvide = ref<TUserOption | null>(null)

const showNewBoardRoleDialog = ref(false)

async function onAddBoardRoleSubmit () {
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
      await BoardsApiService.addBoardRole({
        board_id: board.value?.board_id,
        role_id: roleToProvide.value?.value,
        user_id: userToProvide.value?.value
      })
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'check_circle',
        message: t('ROLE_GRANTED')
      })
      boardsStore.getBoardRoles(route.params.id as string)
    } catch (e) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: e.message
      })
    }

    showNewBoardRoleDialog.value = false
    roleToProvide.value = null
    userToProvide.value = null
  }
}

// type TRolesFilters = 'user' | 'role'

const boardRoles = computed(() => boardsStore.boardRoles)
const localRoles = ref<IBoardUserRole[]>([])
const selectedUsersRoles = computed(() => localRoles.value.filter(i => i.roles.some(r => r.isActive)))

// const rolesFilter = ref<TRolesFilters>('user')

const showDeleteBoardRoleBtn = computed(() => localRoles.value.some(i => i.isActive) || localRoles.value.some(i => i.roles.some(r => r.isActive)))
const showDeleteBoardRoleDialog = ref(false)

boardsStore.getBoardRoles(route.params.id as string)

function refreshLocalRoles (val: IBoardUserRole[]) {
  localRoles.value = val.filter(i => i.roles.length).map((item: IBoardUserRole) => {
    item.roles = item.roles.map(r => {
      return { ...r, isActive: false }
    })
    return {
      ...item,
      isActive: false
    }
  })
}

watch(() => boardRoles.value, async (val) => {
  refreshLocalRoles(val)
})

function updateUserRolesChecks (item: IBoardUserRole, type: 'user' | 'role') {
  if (type === 'user') {
    item.roles = item.roles.map(r => {
      return { ...r, isActive: item.isActive }
    })
  } else {
    item.isActive = item.roles.every(r => r.isActive)
  }
}

async function onDeleteBoardRoleSubmit () {
  const selectedUsersPrepared = localRoles.value
    .filter(i => i.roles.some(r => r.isActive))
    .map(i => {
      return {
        id: i.id,
        board_id: i.board_id,
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
    await BoardsApiService.deleteBoardRoles(selectedUsersPrepared)
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ROLE_DELETED')
    })
    await boardsStore.getBoardRoles(route.params.id as string)
  } catch (e) {
    refreshLocalRoles(localRoles.value)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  showDeleteBoardRoleDialog.value = false
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
.board-wrapper
  width: 100%
.form-wrapper
  width: 100%
  max-width: 350px
.board-form:deep
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
.board-controls
  display: flex
  justify-content: space-between
  align-items: center
.board-user-wrapper
  flex-direction: row
  justify-content: start
  align-items: center
.board-user-link
  text-decoration: none
  color: $primary
  &:hover
    color: black
.board-role-link
  text-decoration: none
  color: $primary
  display: flex
  align-items: center
  &:hover
    color: black
</style>
