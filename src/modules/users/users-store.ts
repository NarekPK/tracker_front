import { defineStore } from 'pinia'
import { TUser } from './services/users-api.interface'
import { UsersApiService } from './services/'
import { ref } from 'vue'

export const useUsersStore = defineStore('users',() => {
  const user = ref<TUser | null>(null)

  async function getUser () {
    try {
      user.value = await UsersApiService.getUser()
    } catch (error) {
      console.log(error)
    }
  }

  return { user, getUser }
})
