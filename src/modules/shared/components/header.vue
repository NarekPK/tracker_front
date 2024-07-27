<template>
  <div class="header-wrapper q-pa-sm q-mb-xl flex justify-center">
    <a href="/projects"><img class="logo" src="~assets/logo.svg" alt=""></a>
    <div class="header-menu">
      <q-btn-group class="main-menu text-primary q-mr-md">
        <q-btn href="/projects" :label="t('PROJECTS')" class="desktop-menu-btn menu text-bold" />
        <q-btn href="/boards" :label="t('AGILE_BOARDS')" class="desktop-menu-btn text-bold" />
        <q-btn href="/issues" :label="t('ISSUES')" class="desktop-menu-btn text-bold" />
        <q-btn href="/articles" :label="t('KNOWLEDGE_BASE')" class="desktop-menu-btn text-bold" disabled />
        <q-btn
          class="mobile-menu-btn"
          icon="menu"
          color="primary"
          dense
          flat
        >
          <q-menu auto-close class="text-bold text-primary">
            <q-list style="min-width: 100px">
              <q-item href="/projects" clickable>
                <q-item-section>{{ t('PROJECTS') }}</q-item-section>
              </q-item>
              <q-item href="/boards" clickable>
                <q-item-section>{{ t('AGILE_BOARDS') }}</q-item-section>
              </q-item>
              <q-item href="/issues" clickable>
                <q-item-section>{{ t('ISSUES') }}</q-item-section>
              </q-item>
              <q-item href="/articles" clickable disabled>
                <q-item-section>{{ t('KNOWLEDGE_BASE') }}</q-item-section>
              </q-item>
              <!-- <q-item href="/groups" clickable disabled>
                <q-item-section>{{ t('GROUPS') }}</q-item-section>
              </q-item>
              <q-item href="/organizations" clickable disabled>
                <q-item-section>{{ t('ORGANIZATIONS') }}</q-item-section>
              </q-item> -->
            </q-list>
          </q-menu>
        </q-btn>
      </q-btn-group>
      <q-btn-group>
        <q-btn
          class=""
          icon="settings"
          color="primary"
          dense
          flat
        >
          <q-menu class="text-bold text-primary">
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>{{ t('ACCESSES') }}</q-item-section>
                  <q-menu class="text-bold text-primary" anchor="top end" self="top start">
                    <q-list style="min-width: 100px">
                      <q-item href="/users" clickable>
                        <q-item-section>{{ t('USERS') }}</q-item-section>
                      </q-item>
                      <!-- <q-item href="/groups" clickable disabled>
                        <q-item-section>{{ t('GROUPS') }}</q-item-section>
                      </q-item>
                      <q-item href="/organizations" clickable disabled>
                        <q-item-section>{{ t('ORGANIZATIONS') }}</q-item-section>
                      </q-item> -->
                      <q-item href="/roles" clickable>
                        <q-item-section>{{ t('ROLES') }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
              </q-item>
              <q-item href="/custom-fields">
                <q-item-section>
                  {{ t('CUSTOM_FIELDS') }}
                </q-item-section>
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
      </q-btn-group>
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
  display: flex
  flex-grow: 2
  justify-content: space-between
.main-menu
  overflow: hidden
.desktop-menu-btn
  display: none
  @media (min-width: 760px)
    display: inline-flex
.mobile-menu-btn
  @media (min-width: 759px)
    display: none
.user
  padding: 4px 8px
  &:deep .q-icon
    margin-right: 6px
</style>
