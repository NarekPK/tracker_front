<template>
  <q-page class="project-page row items-start justify-start">
    <Project />
  </q-page>
</template>

<script setup lang="ts">
import Project from 'src/modules/projects/components/project.vue'

defineOptions({
  name: 'ProjectPage'
});

</script>

<style lang="sass" scoped>
.project-page
  max-width: 1024px
  margin: 0 auto
</style>
