<template>
  <div v-if="task" class="task-wrapper">
    <div class="task-base-info q-mb-md">
      <div class="task-base-info__item">
        <q-btn
          :href="`/project/${task.project?.project_id}`"
          color="primary"
          size="sm"
          target="_blank"
          class="task-base-info__link"
          rounded
        >
          {{ task.project?.name }}
        </q-btn>
      </div>
      <div class="task-base-info__item">
        <div class="task-base-info__item-text">Автор:</div>
        <q-btn
          :href="`/user/${task.user?.user_id}`"
          color="primary"
          size="sm"
          target="_blank"
          outline
          class="task-base-info__link"
          rounded
        >
          {{ task.user?.profile_name }}
        </q-btn>
      </div>
      <div v-if="task.createdAt" class="task-base-info__item">
        <div class="task-base-info__item-text">{{ getTaskCreationDate(task.createdAt) }}</div>
      </div>
    </div>
    <div v-if="!showEditMode" class="task-content">
      <div class="q-mb-lg text-h4 text-weight-bold task-title-wrapper">
        <div class="task-title">{{ task.name }}</div>
        <div class="task-controls">
          <!-- <button class="task-controls__item">
            <q-icon class="task-controls__icon" name="edit" />
          </button> -->
          <q-btn
            class="task-controls__btn"
            icon="edit"
            flat
            padding="5px"
            title="Редактировать задачу"
            rounded
            @click="showEditMode = true"
          ></q-btn>
          <q-btn
            class="task-controls__btn"
            icon="delete"
            flat
            padding="5px"
            title="Удалить задачу"
            rounded
            @click="showDeleteTaskDialog = true"
          ></q-btn>
        </div>
      </div>
      <div class="task-description q-mb-md" v-html="task.description"></div>
    </div>
    <div v-else>
      <q-form
        @submit="onUpdateTaskSubmit"
        class="task-form"
      >
          <q-input
            bottom-slots
            v-model="task.name"
            type="textarea"
            class="update-task-name q-mb-md"
            autogrow
            :rules="[ val => val && val.length > 0 || 'Введите название задачи']"
          />

          <editor
            class="editor"
            :value="task.description"
            @update:value="task.description = $event"
          />

        <div class="flex q-mt-lg">
          <q-btn label="Сохранить" type="submit" color="primary" class="text-bold q-mr-md" />
          <q-btn label="Отмена" @click="showEditMode = false" />
        </div>
      </q-form>
    </div>
    <q-dialog v-model="showDeleteTaskDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Удалить задачу?</div>
        После подтверждения этого действия задача <b>"{{ task.name }}"</b> будета удалена.
        <q-form
          @submit="onDeleteTaskSubmit"
          class="task-form"
        >
          <div class="flex q-mt-lg">
            <q-btn label="Удалить" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn label="Отмена" v-close-popup />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { TasksApiService } from 'src/modules/tasks/services'
import { ITask } from 'src/modules/tasks/services/tasks-api.interface'
import { date } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import editor from 'src/modules/shared/components/editor.vue'

const route = useRoute()
const router = useRouter()

const $q = useQuasar()

const task = ref<ITask | null>(null)

async function getTask (task_id: string) {
  try {
    task.value = await TasksApiService.getTask(task_id)
  } catch (error) {
    console.log(error)
  }
}

getTask(route.params.id as string)

function getTaskCreationDate (taskDate: string) {
  return date.formatDate(taskDate, 'D MMM YYYYг.')
}

const showDeleteTaskDialog = ref(false)

async function onDeleteTaskSubmit (event: Event) {
  event.preventDefault()
  try {
    if (!task.value?.task_id) return
    await TasksApiService.deleteTask({ task_id: task.value?.task_id })
    router.push('/tasks')
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const showEditMode = ref(false)

async function onUpdateTaskSubmit (event: Event) {
  event.preventDefault()
  try {
    await TasksApiService.updateTask({
      name: task.value?.name,
      description: task.value?.description,
      task_id: task.value?.task_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Задача обновлена'
    })
    showEditMode.value = false
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
.task-wrapper
  width: 100%
.task-base-info
  display: flex
  align-items: center
.task-base-info__item
  display: flex
  align-items: center
  margin-right: 20px
.task-base-info__link
  text-decoration: none
  color: $primary
  font-weight: 600
  &:hover
    color: #000
.task-base-info__item-text
  margin-right: 5px
  color: $secondary-text
.task-title-wrapper
  display: flex
  align-items: center
.task-title
  margin-right: 20px
  font-size: 24px
.task-controls
  display: flex
  align-items: center
.task-controls__btn:deep
  margin-right: 5px
  cursor: pointer
  .q-icon
    font-size: 22px
    color: $secondary-text
  &:hover .q-icon
    color: $primary
.task-form:deep
  & input,
  & textarea
    font-weight: bold
.update-task-name:deep
  textarea
    font-weight: bold
    font-size: 24px

</style>
