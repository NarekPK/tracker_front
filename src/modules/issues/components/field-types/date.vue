<template>
  <div class="custom-field">
    <div v-if="showFieldName" class="custom-field__name">{{ fieldName }}</div>
    <button
      class="custom-field__value"
    >
      {{ currentValue }}
      <q-tooltip
        v-if="showNamesTooltip"
        anchor="top middle"
        self="top middle"
        :offset="[25, 25]"
        class="bg-primary"
      >
        {{ fieldName }}
      </q-tooltip>
      <q-menu class="text-bold text-primary" ref="menu">
        <q-date
          v-model="dateVal"
          @update:model-value="updateFieldValue"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn
              :label="t('ERASE')"
              color="primary"
              flat
              @click="updateFieldValue(null)"
              v-close-popup
            />
          </div>
        </q-date>
      </q-menu>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IIssueCustomField } from 'src/modules/issues/services/issues-api.interface'
import { IProjectCustomField } from 'src/modules/projects/services/projects-api.interface'
import { date } from 'quasar'

const emit = defineEmits(['updateFieldValue', 'hide'])

interface IProps {
  field: IProjectCustomField & IIssueCustomField
  showFieldName?: boolean
  showNamesTooltip?: boolean
}

const props = defineProps<IProps>()

const { t } = useI18n()

const fieldName = computed(() => props.field.key ? t(props.field.name) : props.field.name)

const currentValue = computed(() => {
  if (props.field.value) return date.formatDate(props.field.value, 'D MMM YYYY')
  return props.field.key ? t(props.field.empty_value as string) : props.field.empty_value  ?? '?'
})

const dateVal = ref(date.formatDate(props.field.value || Date.now(), 'YYYY/MM/DD'))

function updateFieldValue(value: string | null) {
  emit('updateFieldValue', { id: props.field.custom_field_id, value: value ? Number(date.formatDate(value, 'x')) : null })
  menu.value?.hide()
}

const menu = ref<HTMLElement | null>(null)

</script>

<style lang="sass" scoped>
.custom-field__name
  color: $secondary-text
.custom-field__value
  background: none
  border: 0
  padding: 0
  cursor: pointer
  color: $primary
  font-weight: bold
  text-align: left
  &:hover
    color: #000
</style>
