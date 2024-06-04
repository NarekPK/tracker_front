<template>
  <q-page class="create-task-page row items-start justify-start">
    <create-task />
  </q-page>
</template>

<script setup lang="ts">
import CreateTask from 'src/modules/tasks/components/create-task.vue'

defineOptions({
  name: 'CreateTaskPage'
})

</script>

<style lang="sass" scoped>
.create-task-page
  max-width: 1024px
  margin: 0 auto
</style>
