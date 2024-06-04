import { defineStore } from 'pinia'
import { IRole, IPermission } from './services/roles-api.interface'
import { RolesApiService } from './services/'
import { ref } from 'vue'

const localBasePermissions = localStorage.getItem('basePermissions')

export const useRolesStore = defineStore('roles',() => {
  const role = ref<IRole | null>(null)
  const roles = ref<IRole[]>([])
  const basePermissions = ref<IPermission[]>(localBasePermissions ? JSON.parse(localBasePermissions) : [])

  async function getRole (role_id: string) {
    try {
      role.value = await RolesApiService.getRole(role_id)
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllRoles () {
    try {
      roles.value = await RolesApiService.getAllRoles()
    } catch (error) {
      console.log(error)
    }
  }

  async function getBasePermissions () {
    try {
      basePermissions.value = await RolesApiService.getBasePermissions()
      localStorage.setItem('basePermissions', JSON.stringify(basePermissions.value))
    } catch (error) {
      console.log(error)
    }
  }

  return { role, roles, basePermissions, getRole, getAllRoles, getBasePermissions }
})
