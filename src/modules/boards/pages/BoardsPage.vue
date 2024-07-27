<template>
  <q-page class="boards-page row items-start justify-start">
    <Boards />
  </q-page>
</template>

<script setup lang="ts">
import Boards from 'src/modules/boards/components/boards.vue'

defineOptions({
  name: 'BoardsPage'
});

</script>

<style lang="sass" scoped>
.boards-page
  margin: 0 auto
</style>
