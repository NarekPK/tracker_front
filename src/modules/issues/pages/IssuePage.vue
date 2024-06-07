<template>
  <q-page class="issue-page row items-start justify-start">
    <issue />
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
  max-width: 1024px
  margin: 0 auto
</style>
