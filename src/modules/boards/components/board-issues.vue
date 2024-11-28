<template>
  <div v-if="allCustomFields.length && projectIssues.length && currentBoard" class="board-issues q-pa-md">
    <div
      v-for="column in columns"
      :key="column.position"
      class="board-column-wrapper"
    >
      <div class="board-column__name text-bold q-mb-md">{{ getColumnName(column) }}</div>
      <draggable
        v-bind="dragOptions"
        :list="getColumnIssues(column)"
        :item-key="'id' + column.position"
        :component-data="{
          tag: 'div',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
          key: String(column.position)
        }"
        @start="drag = true"
        @end="drag = false"
        @change="change"
        class="board-column"
      >
        <template #item="{ element }">
          <div class="board-issue q-pa-md">
            <router-link
              :to="`/issue/${element.issue_id}`"
              color="primary"
              class="board-issue__link text-subtitle1 q-mb-md"
              target="_blank"
            >
              {{ element.name }}
            </router-link>
            <IssueCustomFields
              v-if="allCustomFields.length && projectIssues.length"
              class="issue-custom-fields issue-custom-fields--list"
              :customFields="element.custom_fields"
              :projectCustomFields="getProjectCustomFields(element.project_id)"
              :show-field-name="false"
              :show-names-tooltip="true"
              @updateFieldValue="updateFieldValue($event, element)"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { IssuesApiService } from 'src/modules/issues/services'
import { IIssue, IIssueCustomField } from 'src/modules/issues/services/issues-api.interface'
import { IBoard, TBoardEnumOption } from 'src/modules/boards/services/boards-api.interface'
import draggable from 'vuedraggable'
import { ICustomField } from 'src/modules/custom-fields/services/custom-fields-api.interface'
import { CustomFieldsApiService } from 'src/modules/custom-fields/services'
import IssueCustomFields from 'src/modules/issues/components/issue-custom-fields.vue'

interface IProps {
  currentBoard: IBoard
}

const props = defineProps<IProps>()

const $q = useQuasar()
const { t } = useI18n()

const projectIssues = ref<IIssue[]>([])

getProjectIssues()

async function getProjectIssues () {
  projectIssues.value = await IssuesApiService.getProjectIssues(props.currentBoard.projects?.[0].project_id as string)
}

const columns = ref(props.currentBoard.columns_options)

function getColumnName(column: TBoardEnumOption) {
  return column.fields.map(f => t(f.name)).join(', ')
}

const columnsIssues = computed(() => columns.value?.map(col => {
    return {
      ...col,
      issues: projectIssues.value.filter(i => i.custom_fields.some(customField => col.fields.some(columnField => columnField.id === customField.option_id)))
    }
  })
)

function getColumnIssues (column: TBoardEnumOption) {
  return columnsIssues.value?.find(c => c.position == column.position)?.issues
}

const allCustomFields = ref<ICustomField[]>([])
getAllCustomFields()

async function getAllCustomFields () {
  allCustomFields.value = await CustomFieldsApiService.getAllCustomFields()
}

function getProjectCustomFields (project_id: string) {
  return allCustomFields.value.filter((p) => p.project_custom_fields.some(f => f.project_id === project_id))
}

async function updateFieldValue ({ id, value, option_id }: IIssueCustomField, issue: IIssue) {
  try {
    const newCustomFields =[
      ...issue.custom_fields.filter(f => f.id !== id) ?? [],
      option_id ? { id, value, option_id } : { id, value }
    ]
    await IssuesApiService.updateIssue(
      issue.issue_id as string,
      {
        custom_fields: newCustomFields
      }
    )
    if (issue) issue.custom_fields = newCustomFields
    $q.notify({
      color: 'primary',
      textColor: 'white',
      icon: 'check_circle',
      message: t('ISSUE_UPDATED')
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

const drag = ref(false)
const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'issue-ghost'
  }
})

function change (event: { added: { element: IIssue }}) {
  const addedIssue = event.added?.element
  if (addedIssue) {
    const columnField = columnsIssues.value?.find(col => col.issues.some(i => i.issue_id === addedIssue.issue_id))?.fields[0]
    updateFieldValue(
      {
        id: props.currentBoard.columns_field_id as string,
        value: columnField?.name as string,
        option_id: columnField?.id
      },
      addedIssue
    )
  }
}

</script>

<style lang="sass" scoped>
.board-issues
  display: flex
  justify-content: center
  gap: 10px
.board-column-wrapper
  width: 100%
  max-width: 250px
.board-column
  display: flex
  flex-direction: column
  gap: 15px
  max-width: 300px
.board-column__name
  color: #000
.board-issue
  background: #fff
  border-radius: 8px
  box-shadow: $solid-shadow
  align-items: flex-start
.board-issue__link
  text-decoration: none
  color: $primary
  font-size: 16px
  display: flex
  flex-direction: column
  &:hover
    color: #000
    text-decoration: underline
.issue-custom-fields--list
  flex-direction: row
  justify-content: flex-start
  flex-wrap: wrap
  gap: 7px
  &:deep
    .custom-field-wrapper
      overflow: hidden
    .custom-field__value
      color: $secondary-text
      font-weight: 400
      font-size: 12px
      &:hover
        color: $primary
.flip-list-move
  transition: transform 0.5s

.no-move
  transition: transform 0s

.issue-ghost
  opacity: 0.5
  background: #c8ebfb
</style>
