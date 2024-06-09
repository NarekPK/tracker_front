<template>
  <div v-if="issue" class="issue-wrapper">
    <div class="issue-base-info q-mb-md">
      <div class="issue-base-info__item">
        <q-btn
          :href="`/project/${issue.project?.project_id}`"
          color="primary"
          size="sm"
          target="_blank"
          class="issue-base-info__link"
          rounded
        >
          {{ issue.project?.name }}
        </q-btn>
      </div>
      <div class="issue-base-info__item">
        <div class="issue-base-info__item-text">{{ t('AUTHOR') }}:</div>
        <q-btn
          :href="`/user/${issue.user?.user_id}`"
          color="primary"
          size="sm"
          target="_blank"
          outline
          class="issue-base-info__link"
          rounded
        >
          {{ issue.user?.profile_name }}
        </q-btn>
      </div>
      <div v-if="issue.createdAt" class="issue-base-info__item">
        <div class="issue-base-info__item-text">{{ getIssueCreationDate(issue.createdAt) }}</div>
      </div>
    </div>
    <div v-show="!showEditMode" class="issue-content">
      <div class="q-mb-lg text-h4 text-weight-bold issue-title-wrapper">
        <div class="issue-title">{{ issue.name }}</div>
        <div class="issue-controls">
          <q-btn
            class="issue-controls__btn"
            icon="edit"
            flat
            padding="5px"
            :title="t('EDIT_ISSUE')"
            rounded
            @click="showEditMode = true"
          ></q-btn>
          <q-btn
            class="issue-controls__btn"
            icon="delete"
            flat
            padding="5px"
            :title="t('DELETE_ISSUE')"
            rounded
            @click="showDeleteIssueDialog = true"
          ></q-btn>
        </div>
      </div>
      <div
        class="issue-description q-mb-md"
        :class="{ 'issue-description--empty': !issue.description }"
        v-html="issue.description || t('ISSUE_WITHOUT_DESCRIPTION')"
      ></div>
      <IssueComments />
    </div>
    <div v-show="showEditMode">
      <q-form
        @submit="onUpdateIssueSubmit"
        class="issue-form"
      >
          <q-input
            bottom-slots
            v-model="issue.name"
            type="textarea"
            class="update-issue-name q-mb-md"
            autogrow
            :rules="[ val => val && val.length > 0 || t('ENTER_ISSUE_HEADING')]"
          />

          <editor
            class="editor"
            :value="issue.description"
            @update:value="newDescription = $event"
          />

        <div class="flex q-mt-lg">
          <q-btn :label="t('SAVE')" type="submit" color="primary" class="text-bold q-mr-md" />
          <q-btn :label="t('CANCEL')" @click="showEditMode = false" />
        </div>
      </q-form>
    </div>
    <q-dialog v-model="showDeleteIssueDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_ISSUE')}}?</div>
        <i18n-t
          :keypath="'DELETE_ISSUE_WARNING.text'"
          tag="div"
        >
          <template v-slot:selected>
            <b>{{ issue.name }}</b>
          </template>
        </i18n-t>
        <q-form
          @submit="onDeleteIssueSubmit"
          class="issue-form"
        >
          <div class="flex q-mt-lg">
            <q-btn :label="t('DELETE')" type="submit" color="primary" class="text-bold q-mr-md" />
            <q-btn :label="t('CANCEL')" v-close-popup />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { IssuesApiService } from 'src/modules/issues/services'
import { IIssue } from 'src/modules/issues/services/issues-api.interface'
import { date } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import editor from 'src/modules/shared/components/editor.vue'
import { useI18n } from 'vue-i18n'
import IssueComments from 'src/modules/issues/components/issue-comments.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const $q = useQuasar()

const issue = ref<IIssue | null>(null)
const newDescription = ref('')

async function getIssue (issue_id: string) {
  try {
    issue.value = await IssuesApiService.getIssue(issue_id)
    newDescription.value = issue.value?.description ?? ''
  } catch (error) {
    console.log(error)
  }
}

getIssue(route.params.id as string)

function getIssueCreationDate (issueDate: string) {
  return date.formatDate(issueDate, 'D MMM YYYY')
}

const showDeleteIssueDialog = ref(false)

async function onDeleteIssueSubmit (event: Event) {
  event.preventDefault()
  try {
    if (!issue.value?.issue_id) return
    await IssuesApiService.deleteIssue({ issue_id: issue.value?.issue_id })
    router.push('/issues')
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

async function onUpdateIssueSubmit (event: Event) {
  event.preventDefault()
  try {
    await IssuesApiService.updateIssue({
      name: issue.value?.name,
      description: newDescription.value,
      issue_id: issue.value?.issue_id
    })
    if (issue.value) issue.value.description = newDescription.value
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ISSUE_UPDATED')
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
.issue-wrapper
  width: 100%
.issue-base-info
  display: flex
  align-items: center
.issue-base-info__item
  display: flex
  align-items: center
  margin-right: 20px
.issue-base-info__link
  text-decoration: none
  color: $primary
  font-weight: 600
  &:hover
    color: #000
.issue-base-info__item-text
  margin-right: 5px
  color: $secondary-text
.issue-title-wrapper
  display: flex
  align-items: center
.issue-title
  margin-right: 20px
  font-size: 24px
.issue-controls
  display: flex
  align-items: center
.issue-controls__btn:deep
  margin-right: 5px
  cursor: pointer
  .q-icon
    font-size: 22px
    color: $secondary-text
  &:hover .q-icon
    color: $primary
.issue-form:deep
  & input,
  & textarea
    font-weight: bold
.update-issue-name:deep
  textarea
    font-weight: bold
    font-size: 24px
.issue-description
  border-bottom: 1px dashed rgba(10, 8, 58, 0.13)
  padding-bottom: 24px
.issue-description--empty
  color: $secondary-text
</style>
