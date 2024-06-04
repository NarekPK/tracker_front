<template>
  <q-page class="task-page row items-start justify-start">
    <task />
  </q-page>
</template>

<script setup lang="ts">
import Task from 'src/modules/tasks/components/task.vue'

defineOptions({
  name: 'TaskPage'
});

</script>

<style lang="sass" scoped>
.task-page
  max-width: 1024px
  margin: 0 auto
</style>
