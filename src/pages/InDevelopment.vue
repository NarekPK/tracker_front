<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ t('IN_DEVELOPMENT') }}
      </div>

      <q-btn
        class="q-mt-xl text-bold"
        color="white"
        text-color="blue"
        unelevated
        to="/projects"
        :label="t('GO_HOME')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineOptions({
  name: 'ErrorNotFound'
})

</script>
