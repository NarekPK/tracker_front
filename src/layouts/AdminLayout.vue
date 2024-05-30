<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="q-pa-sm">
      <Header />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
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

</script>
