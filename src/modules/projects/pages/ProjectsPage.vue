<template>
  <q-page class="projects-page row items-start justify-start">
    <projects />
  </q-page>
</template>

<script setup lang="ts">
import Projects from 'src/modules/projects/components/projects.vue'

defineOptions({
  name: 'ProjectsPage'
});

</script>

<style lang="sass" scoped>
.projects-page
  max-width: 1024px
  margin: 0 auto
</style>
