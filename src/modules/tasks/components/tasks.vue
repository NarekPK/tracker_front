<template>
  <div class="tasks-wrapper">
    <div class="flex justify-center items-center column">
      <q-btn
        label="Новая задача"
        color="primary"
        class="text-bold q-mt-md q-mr-md q-mb-lg"
        :class="{ 'offset-btn': !tasks.length }"
        rounded
        @click="handleCreateNewTask"
      />
      <div v-if="!tasks.length" class="text-h6 text-center">Задач пока нет. Начните с создания <router-link to="/projects">проекта</router-link> или задачи</div>
    </div>

    <div v-if="tasks.length" class="tasks-filters flex justify-center">
      <q-input
        v-model="filterText"
        :dense="true"
        class="tasks-filter tasks-filter-search"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select v-model="filterProject" :options="projectsOptions" class="tasks-filter q-mb-lg" label="Проект" clearable :dense="true" />
      <q-select v-model="filterAuthor" :options="authorsOptions" class="tasks-filter q-mb-lg" label="Автор" clearable :dense="true" />
    </div>

    <div
      v-for="task in tasksFiltered"
      :key="task.task_id"
      class="flex tasks"
    >
      <q-card class="tasks__item q-mb-lg q-pa-md">
        <div class="tasks__intro q-mb-sm">
          <div class="tasks__intro-item">
            <q-btn
              :href="`/project/${task.project?.project_id}`"
              color="primary"
              size="sm"
              target="_blank"
              class="tasks__intro-project"
              rounded
            >
              {{ task.project?.name }}
            </q-btn>
          </div>
          <div class="tasks__intro-item">
            <div class="tasks__intro-item-text">Автор:</div>
            <q-btn
              :href="`/user/${task.user?.user_id}`"
              color="primary"
              size="sm"
              target="_blank"
              outline
              class="tasks__intro-project"
              rounded
            >
              {{ task.user?.profile_name }}
            </q-btn>
          </div>
          <div v-if="task.createdAt" class="tasks__intro-item">
            <div class="tasks__intro-item-text">{{ getTaskCreationDate(task.createdAt) }}</div>
          </div>
        </div>
        <router-link
          :to="`/task/${task.task_id}`"
          color="primary"
          class="tasks__link text-subtitle1"
        >
          {{ task.name }}
        </router-link>
      </q-card>
    </div>

    <q-dialog v-model="showNewTaskDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Создание новой задачи</div>
        <q-form
          @submit="onAddTaskSubmit"
          class="new-task-form"
        >
        <q-select filled v-model="targetProject" :options="projectsOptions" class="q-mb-lg" label="Выберите проект" />

          <div class="flex q-mt-lg">
            <q-btn label="Создать" type="submit" color="primary" class="text-bold q-mr-md" />
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
import { ProjectsApiService } from 'src/modules/projects/services'
import { IProject } from 'src/modules/projects/services/projects-api.interface'
import { useTasksStore } from 'src/modules/tasks/tasks-store'
import { useRouter } from 'vue-router'
import { date } from 'quasar'
import { useUsersStore } from 'src/modules/users/users-store'

const router = useRouter()
const $q = useQuasar()

const tasksStore = useTasksStore()

tasksStore.getAllTasks()
const tasks = computed(() => tasksStore.tasks)

async function handleCreateNewTask () {
  await getProjectsInfo()
  if (!projects.value.length) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Сначала создайте проект'
    })
  } else {
    showNewTaskDialog.value = true
  }
}

const showNewTaskDialog = ref(false)

async function onAddTaskSubmit () {
  if (!targetProject.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Выберите проект или создайте новый'
    })
  }
  else {
    router.push(`/create-task/?project_id=${targetProject.value.value}`)
  }
}

let projects = ref<IProject[]>([])

type TProjectOption = { value: string, label: string }
const projectsOptions = computed(() => projects.value.map(p => {
  return { value: p.project_id, label: p.name } as TProjectOption
}))
const targetProject = ref<TProjectOption | null>(null)

async function getProjectsInfo () {
  projects.value = await ProjectsApiService.getAllProjects()
}

getProjectsInfo()


function getTaskCreationDate (taskDate: string) {
  return date.formatDate(taskDate, 'D MMM YYYYг.')
}

// Filters

const usersStore = useUsersStore()
usersStore.getAllUsers()
const users = computed(() => usersStore.users)

type TUserOption = { value: string, label: string }
const authorsOptions = computed(() => users.value.map(p => {
  return { value: p.user_id, label: p.profile_name } as TUserOption
}))


const filterProject = ref<TProjectOption | null>(null)
const filterAuthor = ref<TUserOption | null>(null)
const filterText = ref('')

function getFormatText (text: string = '') {
  return text.toLowerCase().trim()
}

const tasksFiltered = computed(() => {
  const formattedFilterText = getFormatText(filterText.value)
  return tasks.value.filter(t => {
    return (!filterProject.value || t.project?.project_id === filterProject.value.value) &&
    (!filterAuthor.value || t.user?.user_id === filterAuthor.value?.value) &&
    (!filterText.value ||
      getFormatText(t.name).includes(formattedFilterText) ||
      getFormatText(t.description).includes(formattedFilterText) ||
      getFormatText(t.project?.name).includes(formattedFilterText) ||
      getFormatText(t.user?.profile_name).includes(formattedFilterText)
    )
  })
})

</script>

<style lang="sass" scoped>
.tasks-wrapper
  width: 100%
.offset-btn
  margin-top: 15vh
.new-task-form:deep
  width: 350px
  max-width: 100%
.tasks
  width: 100%
.tasks__item
  width: 100%
.tasks__intro
  display: flex
  align-items: center
.tasks__item-project
  color: $secondary-text
  text-decoration: none
.tasks__intro-item
  display: flex
  align-items: center
  margin-right: 15px
.tasks__intro-item-text
  margin-right: 5px
  color: $secondary-text
.tasks__link
  text-decoration: none
  color: $primary
  font-weight: 600
  font-size: 18px
  &:hover
    color: #000
.tasks-filters
  gap: 15px
.tasks-filter
  min-width: 200px
  text-align: center
.tasks-filter-search
  width: 80%

</style>
