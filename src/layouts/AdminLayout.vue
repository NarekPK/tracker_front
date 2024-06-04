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

defineOptions({
  name: 'AdminLayout'
});

const usersStore = useUsersStore()
const rolesStore = useRolesStore()

usersStore.getMe()

if (!localStorage.getItem('basePermissions')) rolesStore.getBasePermissions()

function minHeight () {
  return { minHeight: 'calc(100vh - 170px)' }
}

</script>

<style lang="sass" scoped>
.q-page
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
</style>
