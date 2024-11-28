<template>
  <div class="boards-wrapper">
    <div
      class="boards-head q-pa-md q-mb-lg"
      :class="{ 'justify-center': !boards.length }"
    >
      <div v-if="!boards.length" class="boards-buttons flex justify-center items-center column">
        <div class="q-mb-lg">
          <q-btn
            :label="t('NEW_BOARD')"
            color="primary"
            class="text-bold"
            rounded
            @click="showNewBoardDialog = true"
          />
          <!-- <q-btn
            v-if="boards.length"
            :label="t('DELETE_BOARD')"
            class="text-bold"
            rounded
            @click="showDeleteBoardDialog = true"
          /> -->
        </div>
        <div class="text-h6 text-center">{{ t('BOARDS_INTRO') }}</div>
      </div>
      <template v-if="boards.length">
        <div class="boards-list">
          <div class="boards-title text-h5 text-weight-bold">{{ `${t('BOARDS')}:` }}</div>
          <q-select
            v-model="currentBoard"
            :options="boardsOptions"
            class="current-board"
            :label="t('BOARD')"
            :dense="true"
          />
        </div>
        <div class="boards-head__buttons">
          <q-btn
            :title="t('NEW_BOARD')"
            icon="add"
            class="boards-head__button text-bold"
            rounded
            padding="5px"
            @click="showNewBoardDialog = true"
          />
          <q-btn
            :title="t('DELETE_BOARD')"
            icon="delete"
            class="boards-head__button text-bold"
            rounded
            padding="5px"
            @click="showDeleteBoardDialog = true"
          />
          <q-btn
            :title="t('BOARD_SETTINGS')"
            icon="settings"
            class="boards-head__button text-bold"
            rounded
            padding="5px"
            @click="showBoardSettingsDialog = true"
          />
        </div>
      </template>
    </div>
    <BoardIssues
      v-if="currentBoardInfo"
      :currentBoard="currentBoardInfo"
    />
    <q-dialog v-model="showNewBoardDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_BOARD') }}</div>
        <q-form
          @submit="onAddBoardSubmit"
          class="new-board-form"
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


          <div class="flex q-mt-lg">
            <q-btn :label="t('CREATE')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteBoardDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_BOARD') }}?</div>
        <i18n-t
          :keypath="'DELETE_BOARD_WARNING.text'"
          tag="div"
        >
          <template v-slot:selected>
            <b>{{ currentBoardInfo?.name }}</b>
          </template>
        </i18n-t>
        <q-form
          @submit="onDeleteBoardSubmit"
          class="delete-board-form"
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
import { BoardsApiService } from 'src/modules/boards/services'
import { IBoard } from 'src/modules/boards/services/boards-api.interface'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BoardIssues from 'src/modules/boards/components/board-issues.vue'

const { t } = useI18n()

const usersStore = useUsersStore()
usersStore.getAllUsers()

const router = useRouter()

const $q = useQuasar()

let boards = ref<IBoard[]>([])

type TBoardOption = { value: string, label: string, projectId: string }
const boardsOptions = computed(() => boards.value.map(b => {
  return { value: b.board_id, label: b.name, projectId: b.projects?.[0].project_id } as TBoardOption
}))

const currentBoard = ref<TBoardOption | null>(null)

const currentBoardInfo = computed(() => boards.value.find(b => b.board_id === currentBoard.value?.value))

async function getBoardsInfo () {
  boards.value = await BoardsApiService.getAllBoards()
  currentBoard.value = boardsOptions.value[0]
}

getBoardsInfo()

const boardName = ref('')
const boardDescription = ref(null)

const showNewBoardDialog = ref(false)

async function onAddBoardSubmit () {
  try {
    if (!boardName.value) return
    const newBoard = await BoardsApiService.createBoard({
      name: boardName.value,
      workspace_id: usersStore.me?.workspace_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('PROJECT_CREATED')
    })
    router.push(`/board/${newBoard.board_id}`)
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const showDeleteBoardDialog = ref(false)

async function onDeleteBoardSubmit () {
  try {
    await BoardsApiService.deleteBoard(currentBoardInfo.value?.board_id as string)
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('PROJECT_DELETED')
    })
    getBoardsInfo()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  showDeleteBoardDialog.value = false
}

const showBoardSettingsDialog = ref(false)

</script>

<style lang="sass" scoped>
.boards-wrapper
  width: 100%
.boards-head
  max-width: 1200px
  margin-left: auto
  margin-right: auto
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
  display: flex
  gap: 20px
  flex-wrap: wrap
.boards-list
  display: flex
  align-items: center
  gap: 20px
.current-board
  width: 200px
  max-width: 100%
.boards-head__buttons
  display: flex
  gap: 20px
  flex-wrap: wrap
  align-items: center
.boards-head__button:deep
  cursor: pointer
  .q-icon
    font-size: 22px
    color: $secondary-text
  &:hover .q-icon
    color: $primary
.new-board-form:deep
  & input,
  & textarea
    font-weight: bold
.form-wrapper
  width: 100%
  max-width: 450px
</style>
