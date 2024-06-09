<template>
  <div class="issues-wrapper">
    <div class="flex justify-center items-center column">
      <q-btn
        :label="t('NEW_ISSUE')"
        color="primary"
        class="text-bold q-mt-md q-mr-md q-mb-lg"
        :class="{ 'offset-btn': !issues.length }"
        rounded
        @click="handleCreateNewIssue"
      />
      <i18n-t
        v-if="!issues.length"
        :keypath="'ISSUES_INTRO.text'"
        tag="div"
        class="text-h6 text-center"
      >
        <template v-slot:url>
          <router-link to="/projects">{{ t('ISSUES_INTRO.url') }}</router-link>
        </template>
      </i18n-t>
    </div>

    <div v-if="issues.length" class="issues-filters flex justify-center">
      <q-input
        v-model="filterText"
        :dense="true"
        class="issues-filter issues-filter-search"
        outlined
        :placeholder="t('ENTER_SEARCH_REQUEST')"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        v-model="filterProject"
        :options="projectsOptions"
        class="issues-filter q-mb-lg"
        :label="t('PROJECT')"
        clearable
        :dense="true"
      />
      <q-select
        v-model="filterAuthor"
        :options="authorsOptions"
        class="issues-filter q-mb-lg"
        :label="t('AUTHOR')"
        clearable
        :dense="true"
      />
    </div>

    <div v-if="issues.length && !issuesFiltered.length" class="text-h6 text-center q-mt-xl text-bold">{{ t('NO_ISSUES_FOUND') }}</div>
    <div
      v-for="issue in issuesFiltered"
      :key="issue.issue_id"
      class="flex issues"
    >
      <q-card class="issues__item q-mb-lg q-pa-md">
        <div class="issues__intro q-mb-sm">
          <div class="issues__intro-item">
            <q-btn
              :href="`/project/${issue.project?.project_id}`"
              color="primary"
              size="sm"
              target="_blank"
              class="issues__intro-project"
              rounded
            >
              {{ issue.project?.name }}
            </q-btn>
          </div>
          <div class="issues__intro-item">
            <div class="issues__intro-item-text">{{ t('AUTHOR') }}:</div>
            <q-btn
              :href="`/user/${issue.user?.user_id}`"
              color="primary"
              size="sm"
              target="_blank"
              outline
              class="issues__intro-project"
              rounded
            >
              {{ issue.user?.profile_name }}
            </q-btn>
          </div>
          <div v-if="issue.createdAt" class="issues__intro-item">
            <div class="issues__intro-item-text">{{ getIssueCreationDate(issue.createdAt) }}</div>
          </div>
        </div>
        <router-link
          :to="`/issue/${issue.issue_id}`"
          color="primary"
          class="issues__link text-subtitle1"
        >
          {{ issue.name }}
        </router-link>
      </q-card>
    </div>

    <q-dialog v-model="showNewIssueDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('CREATE_NEW_ISSUE') }}</div>
        <q-form
          @submit="onAddIssueSubmit"
          class="new-issue-form"
        >
        <q-select filled v-model="targetProject" :options="projectsOptions" class="q-mb-lg" :label="t('SELECT_PROJECT')" />

          <div class="flex q-mt-lg">
            <q-btn :label="t('CREATE')" type="submit" color="primary" class="text-bold q-mr-md" />
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
import { ProjectsApiService } from 'src/modules/projects/services'
import { IProject } from 'src/modules/projects/services/projects-api.interface'
import { useIssuesStore } from 'src/modules/issues/issues-store'
import { useRouter } from 'vue-router'
import { date } from 'quasar'
import { useUsersStore } from 'src/modules/users/users-store'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const router = useRouter()
const $q = useQuasar()

const issuesStore = useIssuesStore()

issuesStore.getAllIssues()
const issues = computed(() => issuesStore.issues)

async function handleCreateNewIssue () {
  await getProjectsInfo()
  if (!projects.value.length) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('FIRST_CREATE_PROJECT')
    })
  } else {
    showNewIssueDialog.value = true
  }
}

const showNewIssueDialog = ref(false)

async function onAddIssueSubmit () {
  if (!targetProject.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('SELECT_OR_CREATE_PROJECT')
    })
  }
  else {
    router.push(`/create-issue/?project_id=${targetProject.value.value}`)
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


function getIssueCreationDate (issueDate: string) {
  return date.formatDate(issueDate, 'D MMM YYYY')
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
  return text?.toLowerCase().trim()
}

const issuesFiltered = computed(() => {
  const formattedFilterText = getFormatText(filterText.value)
  return issues.value.filter(t => {
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
.issues-wrapper
  width: 100%
.offset-btn
  margin-top: 15vh
.new-issue-form:deep
  width: 350px
  max-width: 100%
.issues
  width: 100%
.issues__item
  width: 100%
.issues__intro
  display: flex
  align-items: center
.issues__item-project
  color: $secondary-text
  text-decoration: none
.issues__intro-item
  display: flex
  align-items: center
  margin-right: 15px
.issues__intro-item-text
  margin-right: 5px
  color: $secondary-text
.issues__link
  text-decoration: none
  color: $primary
  font-weight: 600
  font-size: 18px
  &:hover
    color: #000
.issues-filters
  gap: 15px
.issues-filter
  min-width: 200px
  text-align: center
.issues-filter-search
  width: 80%

</style>
