<template>
  <div class="issues-wrapper">
    <div class="project-title q-mb-lg text-h5 text-weight-bold">{{ t('NEW_ISSUE') }}</div>
    <q-form
      @submit="onCreateIssueSubmit"
      class="new-issue-form"
    >
        <q-input
          bottom-slots
          v-model="issueName"
          :label="t('HEADING')"
          type="textarea"
          class="new-issue-name q-mb-md"
          autogrow
          :rules="[ val => val && val.length > 0 || t('ENTER_ISSUE_HEADING')]"
        />

        <Editor
          class="editor"
          :value="issueDescription"
          @update:value="issueDescription = $event"
        />

      <div class="flex q-mt-lg">
        <q-btn :label="t('CREATE')" type="submit" color="primary" class="text-bold q-mr-md" />
        <q-btn :label="t('CANCEL')" @click="router.back()"/>
      </div>
    </q-form>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Editor from 'src/modules/shared/components/editor.vue'
import { useQuasar } from 'quasar'
import { IssuesApiService } from 'src/modules/issues/services'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from 'src/modules/users/users-store'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const usersStore = useUsersStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const me = computed(() => usersStore.me)

const issueName = ref('')
const issueDescription = ref('')

async function onCreateIssueSubmit () {
  try {
    if (!issueName.value) return
    const newIssue = await IssuesApiService.createIssue({
      name: issueName.value,
      description: issueDescription.value,
      issue_author: me.value?.user_id,
      project_id: route.query.project_id as string,
      workspace_id: me.value?.workspace_id
    })
    router.push(`/issue/${newIssue.issue_id}`)
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
.issues-wrapper
  width: 100%
.new-issue-name:deep
  textarea
    font-weight: bold
    font-size: 24px


</style>
