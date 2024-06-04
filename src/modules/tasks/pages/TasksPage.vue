<template>
  <q-page class="tasks-page row items-start justify-start">
    <tasks />
  </q-page>
</template>

<script setup lang="ts">
import Tasks from 'src/modules/tasks/components/tasks.vue'

defineOptions({
  name: 'TasksPage'
});

</script>

<style lang="sass" scoped>
.tasks-page
  max-width: 1024px
  margin: 0 auto
</style>
