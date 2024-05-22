<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Раздел в разработке
      </div>

      <q-btn
        class="q-mt-xl text-bold"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="На Главную"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound'
});
</script>
