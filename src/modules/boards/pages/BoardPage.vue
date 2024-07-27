<template>
  <q-page class="board-page row items-start justify-start">
    <Board />
  </q-page>
</template>

<script setup lang="ts">
import Board from 'src/modules/boards/components/board.vue'

defineOptions({
  name: 'BoardPage'
});

</script>

<style lang="sass" scoped>
.board-page
  max-width: 1024px
  margin: 0 auto
</style>
