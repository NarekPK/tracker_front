<template>
  <div class="custom-field">
    <div v-if="showFieldName" class="custom-field__name">{{ fieldName }}</div>
    <button class="custom-field__value">
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
      <q-menu auto-close class="text-bold text-primary">
        <q-list style="min-width: 100px">
          <q-item
            v-if="props.field.empty_value"
            clickable
            @click="updateFieldValue(field.custom_field_id, null)"
          >
            <q-item-section>{{ field.key ? t(props.field.empty_value) : props.field.empty_value }}</q-item-section>
          </q-item>
          <q-item
            v-for="user in usersStore.users"
            :key="user.user_id"
            clickable
            @click="updateFieldValue(field.custom_field_id, user.user_id ?? '')"
          >
            <q-item-section>{{ user.profile_name }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from 'src/modules/users/users-store'
import { useI18n } from 'vue-i18n'
import { IIssueCustomField } from 'src/modules/issues/services/issues-api.interface'
import { IProjectCustomField } from 'src/modules/projects/services/projects-api.interface'

const emit = defineEmits(['updateFieldValue'])

interface IProps {
  field: IProjectCustomField & IIssueCustomField
  showFieldName: boolean
  showNamesTooltip: boolean
}

const props = defineProps<IProps>()

const { t } = useI18n()

const usersStore = useUsersStore()

const fieldName = computed(() => props.field.key ? t(props.field.name) : props.field.name)

const currentValue = computed(() => {
  if (props.field.value) return usersStore.users.find(user => user.user_id === props.field.value)?.profile_name
  if (props.field.key) return t(props.field.empty_value ?? '?')
  return props.field.empty_value  ?? '?'
})

function updateFieldValue(id: string, value: string | null) {
  emit('updateFieldValue', { id, value })
}

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
