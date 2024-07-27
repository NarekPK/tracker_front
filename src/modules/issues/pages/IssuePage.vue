<template>
  <q-page class="issue-page row items-start justify-start">
    <Issue />
  </q-page>
</template>

<script setup lang="ts">
import Issue from 'src/modules/issues/components/issue.vue'

defineOptions({
  name: 'IssuePage'
});

</script>

<style lang="sass" scoped>
.issue-page
  max-width: 1300px
  margin: 0 auto
  padding: 0
</style>
