<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="q-pa-sm">
      <Header />
      <router-view class="q-pa-md" :style-fn="minHeight" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Header from 'src/modules/shared/components/header.vue'
import { useUsersStore } from 'src/modules/users/users-store'
import { useRolesStore } from 'src/modules/roles/roles-store'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'AdminLayout'
})

const route = useRoute()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

usersStore.getMe()

if (!localStorage.getItem('basePermissions')) rolesStore.getBasePermissions()

const AUTO_MIN_HEIGHT_PAGES = ['issue']

function minHeight () {
  return { minHeight: AUTO_MIN_HEIGHT_PAGES.includes(route.name as string) ? 'auto' : 'calc(100vh - 170px)' }
}

</script>

<style lang="sass" scoped>
.q-page
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
</style>
