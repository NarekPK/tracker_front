<template>
  <div class="issue-comments-wrapper">
    <div class="text-subtitle1 text-weight-bold q-pa-sm">{{ t('COMMENTS') }}</div>
    <div class="issue-comments q-mb-md">
      <div
        v-for="comment in issueComments"
        :key="comment.comment_id"
        class="issue-comments__item q-pa-sm"
      >
        <template v-if="commentIdToEdit !== comment.comment_id">
          <div class="issue-comments__item-head q-mb-sm">
            <div class="issue-comments__item-intro">
              <q-btn
                :href="`/user/${comment.user?.user_id}`"
                size="sm"
                target="_blank"
                class="issue-comments__item-link"
                rounded
              >
                {{ comment.user?.profile_name }}
              </q-btn>
              <div class="issue-comments__item-comment-time">
                {{ `${t('ISSUE_COMMENTED')} ${date.formatDate(comment.createdAt, 'D MMM YYYY')}` }}
              </div>
            </div>
            <div v-if="comment.user?.user_id === usersStore.me?.user_id" class="issue-comments__item-controls">
              <q-btn
                class="issue-comments__item-controls-btn"
                icon="edit"
                flat
                padding="5px"
                :title="t('EDIT_ISSUE_COMMENT')"
                rounded
                @click="commentIdToEdit = comment.comment_id ?? ''"
              ></q-btn>
              <q-btn
                class="issue-comments__item-controls-btn"
                icon="delete"
                flat
                padding="5px"
                :title="t('DELETE_ISSUE_COMMENT')"
                rounded
                @click="handleDeleteComment(comment.comment_id)"
              ></q-btn>
            </div>
          </div>
          <div class="issue-comments__item-text" v-html="comment.text"></div>
        </template>
      <template v-else>
        <q-form
          class="issue-comment-form"
        >
          <Editor
            class="editor comment-editor"
            :value="comment.text"
            :fixedHeight="false"
            :isComment="true"
            @update:value="commentTextToUpdate = $event"
          />

          <div class="flex q-mt-lg">
            <q-btn
              :disabled="!commentTextToUpdate.length"
              :label="t('SAVE')"
              color="primary"
              class="text-bold q-mr-md"
              @mousedown="onUpdateIssueComment(comment.comment_id)"
            />
            <q-btn
              :label="t('CANCEL')"
              @mousedown="cancelCommentUpdate"
            />
          </div>
        </q-form>
      </template>
      </div>
    </div>
    <q-form
      class="issue-comment-form"
    >
      <Editor
        class="editor comment-editor"
        :value="newComment"
        :showMenu="editorFocused"
        :fixedHeight="false"
        :isComment="true"
        @update:value="newComment = $event"
        @editor-focus="handleFocused"
        @editor-blur="editorFocused = false"
      />

      <div v-if="newComment.length || editorFocused" class="flex q-mt-lg" ref="commentEditorButtons">
        <q-btn
          :label="t('ADD_COMMENT')"
          color="primary"
          class="text-bold q-mr-md"
          @mousedown="onAddIssueComment"
        />
        <q-btn
          :label="t('CANCEL')"
          @mousedown="newComment = ''"
        />
      </div>
    </q-form>
    <q-dialog v-model="showDeleteCommentDialog">
      <q-card class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md">{{ t('DELETE_ISSUE_COMMENT_WARNING')}}?</div>
        <q-form
          @submit="onDeleteCommentSubmit"
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
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { IssuesApiService } from 'src/modules/issues/services'
import { IIssueComment } from 'src/modules/issues/services/issues-api.interface'
import { date } from 'quasar'
import { useRoute } from 'vue-router'
import Editor from 'src/modules/shared/components/editor.vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from 'src/modules/users/users-store'

const { t } = useI18n()

const route = useRoute()

const $q = useQuasar()

const usersStore = useUsersStore()
const newComment = ref('')
const editorFocused = ref(false)
const issueComments = ref<IIssueComment[]>([])

getIssueComments()

async function getIssueComments () {
  try {
    issueComments.value = await IssuesApiService.getIssueComments(route.params.id as string)
  } catch (error) {
    console.log(error)
  }
}

async function onAddIssueComment () {
  try {
    await IssuesApiService.addIssueComment({
      text: newComment.value,
      user_id: usersStore.me?.user_id,
      issue_id: route.params.id as string
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ISSUE_COMMENT_ADDED')
    })
    newComment.value = ''
    editorFocused.value = false
    getIssueComments()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const commentIdToEdit = ref('')
const commentEditorButtons = ref<HTMLElement | null>(null)
const commentTextToUpdate = ref('')

async function handleFocused () {
  editorFocused.value = true
  await nextTick()
  commentEditorButtons.value?.scrollIntoView(true)
}

function cancelCommentUpdate () {
  commentTextToUpdate.value = ''
  commentIdToEdit.value = ''
}

async function onUpdateIssueComment (comment_id: string) {
  try {
    await IssuesApiService.updateIssueComment({
      text: commentTextToUpdate.value,
      comment_id
    })
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ISSUE_COMMENT_UPDATED')
    })
    commentTextToUpdate.value = ''
    commentIdToEdit.value = ''
    editorFocused.value = false
    getIssueComments()
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: e.message
    })
  }
}

const showDeleteCommentDialog = ref(false)
const toDeleteCommentId = ref('')

function handleDeleteComment (commentId: string = '') {
  showDeleteCommentDialog.value = true
  toDeleteCommentId.value = commentId
}

async function onDeleteCommentSubmit (event: Event) {
  event.preventDefault()
  try {
    await IssuesApiService.deleteIssueComment({ comment_id: toDeleteCommentId.value })
    getIssueComments()
    showDeleteCommentDialog.value = false
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ISSUE_COMMENT_DELETED')
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

</script>

<style lang="sass" scoped>
.comment-editor
  border: 1px dashed $secondary-text
.issue-comments__item
  border-radius: 8px
  &:hover
    background: rgba(10, 8, 58, 0.03)
.issue-comments__item-head
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
.issue-comments__item-intro
  display: flex
  gap: 10px
  flex-direction: column
  align-items: flex-start
  @media (min-width: 500px)
    flex-direction: row
    align-items: center
.issue-comments__item-link
  background: #fff
  transition: background 0.6s, color 0.3s
  font-weight: bold
  &:hover
    background: $primary
    color: #fff
.issue-comments__item-comment-time
  color: $secondary-text
.issue-comments__item-controls
  display: flex
  align-items: center
  opacity: 0
  transition: opacity 0.3s
  .issue-comments__item:hover &
    opacity: 1
  @media (hover: none) and (pointer:coarse)
    opacity: 1
.issue-comments__item-controls-btn:deep
  margin-right: 5px
  cursor: pointer
  .q-icon
    font-size: 22px
    color: $primary
</style>
