<template>
  <div class="projects-wrapper">
    <div class="flex justify-center items-center column">
      <div class="q-mt-md q-mb-lg">
        <q-btn
          :label="t('NEW_PROJECT')"
          color="primary"
          class="text-bold q-mr-md"
          :class="{ 'offset-btn': !projects.length }"
          rounded
          @click="showNewProjectDialog = true"
        />
        <q-btn
          v-if="selected.length"
          :label="t('DELETE_PROJECT')"
          class="text-bold"
          rounded
          @click="showDeleteProjectDialog = true"
        />
      </div>
      <div v-if="!projects.length" class="text-h6 text-center">{{ t('PROJECTS_INTRO') }}</div>
    </div>
    <template v-if="projects.length">
      <div class="projects-title q-mb-lg text-h5 text-weight-bold">{{ `${t('PROJECTS')}: ${projects.length}` }}</div>
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
    </template>

    <q-dialog v-model="showNewProjectDialog">
      <q-card class="q-pa-lg form-wrapper">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_PROJECT') }}</div>
        <q-form
          @submit="onAddProjectSubmit"
          class="new-project-form"
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


          <div class="flex q-mt-lg">
            <q-btn :label="t('CREATE')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup/>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteProjectDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_PROJECT') }}?</div>
        <i18n-t
          :keypath="'DELETE_PROJECT_WARNING.text'"
          tag="div"
        >
          <template v-slot:selected>
            <b>{{selected[0].name}}</b>
          </template>
        </i18n-t>
        <q-form
          @submit="onDeleteProjectSubmit"
          class="delete-project-form"
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
import { ProjectsApiService } from 'src/modules/projects/services'
import { IProject } from 'src/modules/projects/services/projects-api.interface'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const usersStore = useUsersStore()
const router = useRouter()

const $q = useQuasar()

let projects = ref<IProject[]>([])

const selected = ref<IProject[]>([])

let columns = ref([
  {
    name: 'name',
    required: true,
    label: t('NAME'),
    align: 'left',
    field: (project: IProject) => project.name,
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
      message: t('PROJECT_CREATED')
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
    await ProjectsApiService.deleteProject(selected.value[0].project_id)
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('PROJECT_DELETED')
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
.offset-btn
  margin-top: 15vh
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
.new-project-form:deep
  & input,
  & textarea
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
