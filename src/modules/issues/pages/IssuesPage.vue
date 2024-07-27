<template>
  <q-page class="issues-page row items-start justify-start">
    <Issues />
  </q-page>
</template>

<script setup lang="ts">
import Issues from 'src/modules/issues/components/issues.vue'

defineOptions({
  name: 'IssuesPage'
});

</script>

<style lang="sass" scoped>
.issues-page
  max-width: 1024px
  margin: 0 auto
</style>
