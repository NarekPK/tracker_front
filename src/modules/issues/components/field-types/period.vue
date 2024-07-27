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
      <q-menu class="period text-bold text-primary q-pa-md" ref="menu">
        <div class="period__inputs">
          <q-input
            v-model="weeksEstimate"
            type="number"
            min="0"
            :dense="true"
            class="period__input"
            :rules="[]"
            :hint="t('PERIOD_WEEKS')"
          />
          <q-input
            v-model="daysEstimate"
            type="number"
            min="0"
            max="6"
            :dense="true"
            class="period__input"
            :rules="[]"
            :hint="t('PERIOD_DAYS')"
          />
          <q-input
            v-model="hoursEstimate"
            type="number"
            min="0"
            max="23"
            :dense="true"
            class="period__input"
            :rules="[]"
            :hint="t('PERIOD_HOURS')"
          />
          <q-input
            v-model="minutesEstimate"
            type="number"
            min="0"
            max="59"
            :dense="true"
            class="period__input"
            :rules="[]"
            :hint="t('PERIOD_MINUTES')"
          />
        </div>
        <div class="period__buttons flex q-mt-lg">
          <q-btn
            :label="t('SAVE')"
            color="primary"
            @click="updateFieldValue"
          />
          <q-btn
            :label="t('CANCEL')"
            v-close-popup
          />
        </div>
      </q-menu>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IIssueCustomField } from 'src/modules/issues/services/issues-api.interface'
import { IProjectCustomField } from 'src/modules/projects/services/projects-api.interface'

const emit = defineEmits(['updateFieldValue', 'hide'])

interface IProps {
  field: IProjectCustomField & IIssueCustomField
  showFieldName: boolean
  showNamesTooltip: boolean
}

const props = defineProps<IProps>()

const { t } = useI18n()

const fieldName = computed(() => props.field.key ? t(props.field.name) : props.field.name)

const currentValue = computed(() => {
  if (props.field.value) {
    const [wEst, dEst, hEst, mEst ] = (props.field.value as string).split('.')
    const weeksStr = +wEst ? `${wEst}${t('PERIOD_WEEKS_SHORT')} ` : ''
    const daysStr = +dEst ? `${dEst}${t('PERIOD_DAYS_SHORT')} ` : ''
    const hoursStr = +hEst ? `${hEst}${t('PERIOD_HOURS_SHORT')} ` : ''
    const minutesStr = +mEst ? `${mEst}${t('PERIOD_MINUTES_SHORT')}` : ''
    return weeksStr + daysStr + hoursStr + minutesStr || '?'
  }
  return props.field.empty_value || '?'
})

function updateFieldValue() {
  const value = `${weeksEstimate.value}.${daysEstimate.value}.${hoursEstimate.value}.${minutesEstimate.value}`
  emit('updateFieldValue', { id: props.field.custom_field_id, value })
  menu.value?.hide()
}

const menu = ref<HTMLElement | null>(null)

const estimate = ref((props.field.value as string)?.split('.'))
const weeksEstimate = ref(estimate.value ? estimate.value[0] : 0)
const daysEstimate = ref(estimate.value ? estimate.value[1] : 0)
const hoursEstimate = ref(estimate.value ? estimate.value[2] : 0)
const minutesEstimate = ref(estimate.value ? estimate.value[3] : 0)

// const CHARS_GROUP_1 = ['w','d','m','h']
// const CHARS_GROUP_2 = ['н','д','м','ч']

// function cleanStr (str: string, char: string) {
//   return str.replace(`${char}`, '')
// }

// function validatePeriod () {
//   const preparedPeriod = (estimate.value as string).toLowerCase().replaceAll(' ', '')
//   let str1, str2 = ''
//     CHARS_GROUP_1.forEach(char => {
//       str1 = cleanStr(preparedPeriod, char)
//     })
//     CHARS_GROUP_2.forEach(char => {
//       str2 = cleanStr(preparedPeriod, char)
//     })
//     console.log(str1, str2)

// }
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
.period__buttons
  gap: 10px
.period__inputs
  display: flex
  flex-wrap: wrap
  gap: 5px
  max-width: 200px
.period__input
  width: 45px
</style>
