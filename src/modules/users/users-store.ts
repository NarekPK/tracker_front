import { defineStore } from 'pinia'
import { TUser } from './services/users-api.interface'
import { UsersApiService } from './services/'
import { ref } from 'vue'

export const useUsersStore = defineStore('users',() => {
  const me = ref<TUser | null>(null)
  const user = ref<TUser | null>(null)
  const users = ref<TUser[]>([])

  async function getMe () {
    try {
      me.value = await UsersApiService.getMe()
    } catch (error) {
      console.log(error)
    }
  }

  async function getUser (user_id: string) {
    try {
      user.value = await UsersApiService.getUser(user_id)
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllUsers () {
    try {
      users.value = await UsersApiService.getAllUsers()
    } catch (error) {
      console.log(error)
    }
  }

  return { me, user, users, getMe, getUser, getAllUsers }
})
