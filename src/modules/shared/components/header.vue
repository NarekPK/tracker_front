<template>
  <div class="header-wrapper q-pa-sm q-mb-xl flex justify-center">
    <a href="/projects"><img class="logo" src="~assets/logo.svg" alt=""></a>
    <div class="header-menu">
      <q-btn-group outline class="menu">
        <q-btn href="/projects" outline color="primary" :label="t('PROJECTS')" class="text-bold" />
        <q-btn href="/boards" outline color="primary" :label="t('AGILE_BOARDS')" class="text-bold" disabled />
        <q-btn href="/issues" outline color="primary" :label="t('ISSUES')" class="text-bold" />
        <q-btn href="/articles" outline color="primary" :label="t('KNOWLEDGE_BASE')" class="text-bold" disabled />
        <q-btn
          :label="t('ACCESSES')"
          class="header-menu--item text-bold"
          outline
          color="primary"
        >
          <q-menu auto-close class="bg-primary text-white text-bold">
            <q-list style="min-width: 100px">
              <q-item href="/users" clickable>
                <q-item-section>{{ t('USERS') }}</q-item-section>
              </q-item>
              <q-item href="/groups" clickable disabled>
                <q-item-section>{{ t('GROUPS') }}</q-item-section>
              </q-item>
              <q-item href="/organizations" clickable disabled>
                <q-item-section>{{ t('ORGANIZATIONS') }}</q-item-section>
              </q-item>
              <q-item href="/roles" clickable>
                <q-item-section>{{ t('ROLES') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-btn-group>
      <q-btn
        class="mobile-menu q-mr-md"
        icon="menu"
        color="primary"
        rounded
      >
        <q-menu auto-close class="text-bold text-primary">
          <q-list style="min-width: 100px">
            <q-item href="/projects" clickable>
              <q-item-section>{{ t('PROJECTS') }}</q-item-section>
            </q-item>
            <q-item href="/boards" clickable disabled>
              <q-item-section>{{ t('AGILE_BOARDS') }}</q-item-section>
            </q-item>
            <q-item href="/issues" clickable>
              <q-item-section>{{ t('ISSUES') }}</q-item-section>
            </q-item>
            <q-item href="/articles" clickable disabled>
              <q-item-section>{{ t('KNOWLEDGE_BASE') }}</q-item-section>
            </q-item>
            <q-item href="/users" clickable>
              <q-item-section>{{ t('USERS') }}</q-item-section>
            </q-item>
            <q-item href="/groups" clickable disabled>
              <q-item-section>{{ t('GROUPS') }}</q-item-section>
            </q-item>
            <q-item href="/organizations" clickable disabled>
              <q-item-section>{{ t('ORGANIZATIONS') }}</q-item-section>
            </q-item>
            <q-item href="/roles" clickable>
              <q-item-section>{{ t('ROLES') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        class="user text-bold"
        icon="account_circle"
        color="primary"
        :label="`${usersStore.me?.profile_name || ''}`"
        rounded
      >
        <q-menu auto-close class="text-bold text-primary">
          <q-list style="min-width: 100px">
            <q-item :href="`/user/${usersStore.me?.user_id}`" clickable>
              <q-item-section>
                {{ t('PROFILE') }}
              </q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-item-section>
                {{ t('LOG_OUT') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AuthApiService } from 'src/modules/auth/services'
import { useUsersStore } from 'src/modules/users/users-store'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const usersStore = useUsersStore()
const router = useRouter()

async function logout () {
  await AuthApiService.logout()
  router.push('/login')
}
</script>

<style lang="sass" scoped>
.header-wrapper
  display: flex
  align-items: center
  justify-content: space-between
  max-width: 1024px
  margin-left: auto
  margin-right: auto
  background: #fff
  border-radius: 8px
  box-shadow: $base-shadow
.logo
  margin-right: 15px
.header-menu
  @media (min-width: 760px)
    display: flex
    flex-grow: 2
    justify-content: space-between
.menu
  display: none
  @media (min-width: 760px)
    display: block
.mobile-menu
  @media (min-width: 759px)
    display: none
.user
  padding: 4px 8px
  &:deep .q-icon
    margin-right: 6px
</style>
