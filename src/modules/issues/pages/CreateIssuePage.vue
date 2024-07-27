<template>
  <q-page class="create-issue-page row items-start justify-start">
    <CreateIssue />
  </q-page>
</template>

<script setup lang="ts">
import CreateIssue from 'src/modules/issues/components/create-issue.vue'

defineOptions({
  name: 'CreateIssuePage'
})

</script>

<style lang="sass" scoped>
.create-issue-page
  max-width: 1024px
  margin: 0 auto
</style>
