<template>
  <div class="tasks-wrapper">
    <div class="project-title q-mb-lg text-h5 text-weight-bold">Новая задача</div>
    <q-form
      @submit="onCreateTaskSubmit"
      class="new-task-form"
    >
        <q-input
          bottom-slots
          v-model="taskName"
          label="Заголовок"
          type="textarea"
          class="new-task-name q-mb-md"
          autogrow
          :rules="[ val => val && val.length > 0 || 'Введите название задачи']"
        />

        <editor
          class="editor"
          :value="taskDescription"
          @update:value="taskDescription = $event"
        />

      <div class="flex q-mt-lg">
        <q-btn label="Создать" type="submit" color="primary" class="text-bold q-mr-md" />
        <q-btn label="Отмена" @click="router.back()"/>
      </div>
    </q-form>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import editor from 'src/modules/shared/components/editor.vue'
import { useQuasar } from 'quasar'
import { TasksApiService } from 'src/modules/tasks/services'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from 'src/modules/users/users-store'

const usersStore = useUsersStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const me = computed(() => usersStore.me)

const taskName = ref('')
const taskDescription = ref('')

async function onCreateTaskSubmit () {
  try {
    if (!taskName.value) return
    const newTask = await TasksApiService.createTask({
      name: taskName.value,
      description: taskDescription.value,
      task_author: me.value?.user_id,
      project_id: route.query.project_id as string,
      workspace_id: me.value?.workspace_id
    })
    router.push(`/task/${newTask.task_id}`)
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
.tasks-wrapper
  width: 100%
.new-task-name:deep
  textarea
    font-weight: bold
    font-size: 24px


</style>
