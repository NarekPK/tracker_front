<template>
  <div class="issue-custom-fields">
    <div
      v-for="field in preparedCustomFields"
      :key="field.custom_field_id"
      class="custom-field-wrapper"
    >
      <component
        v-if="MAP_TYPE_TO_COMPONENT[field.field_type]"
        :is="MAP_TYPE_TO_COMPONENT[field.field_type]"
        :key="MAP_TYPE_TO_COMPONENT[field.custom_field_id]"
        :field="field"
        :show-field-name="showFieldName"
        :show-names-tooltip="showNamesTooltip"
        @updateFieldValue="emit('updateFieldValue', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { IIssueCustomField } from 'src/modules/issues/services/issues-api.interface'
import SingleEnum from 'src/modules/issues/components/field-types/single-enum.vue'
import SingleUser from 'src/modules/issues/components/field-types/single-user.vue'
import Date from 'src/modules/issues/components/field-types/date.vue'
import Period from 'src/modules/issues/components/field-types/period.vue'
import { IProjectCustomField } from 'src/modules/projects/services/projects-api.interface'

const emit = defineEmits(['updateFieldValue'])

interface IProps {
  customFields: IIssueCustomField[],
  projectCustomFields: IProjectCustomField[],
  showFieldName?: boolean
  showNamesTooltip?: boolean
}

const props = withDefaults(defineProps<IProps>(),{
  showFieldName: true,
  showNamesTooltip: false
})


interface IFieldTypesComponents {
  [key: string]: Component
}

const MAP_TYPE_TO_COMPONENT: IFieldTypesComponents = {
  'single_enum': SingleEnum,
  'single_user': SingleUser,
  'date': Date,
  'period': Period
}


const preparedCustomFields = computed(() => {
    if (!props.projectCustomFields.length) return []
    return props.projectCustomFields.map(f => {
      return {
        ...f,
        value: props.customFields.find(c => c.id === f.custom_field_id)?.value
      }
    })
  }
)

</script>

<style lang="sass" scoped>
.issue-custom-fields
  display: flex
  flex-direction: column
  justify-content: center
  gap: 15px
</style>
