<template>
  <div class="projects-wrapper">
    <div class="projects-title q-pa-sm q-mb-sm text-h5 text-weight-bold">{{ `Проектов: ${projects.length}` }}</div>
    <q-table
      flat
      :rows="projects"
      :columns="columns"
      row-key="project_id"
      selection="single"
      v-model:selected="selected"
      title-class="primary"
      color="primary"
      class="projects-table"
      table-header-class="projects-table-header"
      :rows-per-page-options="[10]"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="`/project/${props.row.project_id}`"
            color="primary"
            class="projects-link text-subtitle1"
          >
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>
    </q-table>

    <q-btn label="Новый проект" color="primary" class="text-bold q-mt-md q-mr-md" rounded @click="showNewProjectDialog = true" />
    <q-btn v-if="selected.length" label="Удалить проект" class="text-bold q-mt-md" rounded @click="showDeleteProjectDialog = true" />

    <q-dialog v-model="showNewProjectDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">Создание нового проекта</div>
        <q-form
          @submit="onAddProjectSubmit"
          class="new-project-form"
        >
          <q-input
            bottom-slots
            v-model="projectName"  
            label="Имя"
            :rules="[ val => val && val.length > 0 ]"
            filled
          />

          <q-input
            bottom-slots
            v-model="projectDescription"
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

    <q-dialog v-model="showDeleteProjectDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">Удалить проект?</div>
        После подтверждения этого действия проект <b>{{selected[0].name}}</b> будет удален.
        <q-form
          @submit="onDeleteProjectSubmit"
          class="new-project-form"
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
import { ProjectsApiService } from 'src/modules/projects/services'
import { TProject } from 'src/modules/projects/services/projects-api.interface'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRouter } from 'vue-router'

const usersStore = useUsersStore()
const router = useRouter()

const $q = useQuasar()

let projects = ref<TProject[]>([])

const selected = ref<TProject[]>([])

let columns = ref([
  {
    name: 'name',
    required: true,
    label: 'Название',
    align: 'left',
    field: (project: TProject) => project.name,
    sortable: true
  }
])

async function getProjectsInfo () {
  projects.value = await ProjectsApiService.getAllProjects()
}

getProjectsInfo()

const projectName = ref('')
const projectDescription = ref(null)

const showNewProjectDialog = ref(false)

async function onAddProjectSubmit () {
  try {
    if (!projectName.value) return
    const newProject = await ProjectsApiService.createProject({
      name: projectName.value,
      description: projectDescription.value,
      project_owner: usersStore.me?.user_id,
      workspace_id: usersStore.me?.workspace_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Проект создан'
    })
    router.push(`/project/${newProject.project_id}`)
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const showDeleteProjectDialog = ref(false)

async function onDeleteProjectSubmit () {
  try {
    if (!selected.value[0]?.project_id) return
    await ProjectsApiService.deleteProject({ project_id: selected.value[0].project_id })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Проект удален'
    })
    getProjectsInfo()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }

  selected.value = []
  showDeleteProjectDialog.value = false
}

</script>

<style lang="sass" scoped>
.projects-wrapper
  width: 100%
.projects-table:deep
  .projects-table-header
    background: $primary
    color: #fff
  th
    font-weight: 700
  tbody
    font-weight: 500
    tr td:nth-child(2)
      padding: 0
.project-form:deep
  & input
    font-weight: bold
.projects-link
  text-decoration: none
  display: flex
  align-items: center
  height: 100%
.form-wrapper
  width: 100%
  max-width: 450px
</style>