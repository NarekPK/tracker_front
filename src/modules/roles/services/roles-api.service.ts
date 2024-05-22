import MainApiService from 'src/api/main-api.service'
import { TRole, TPermission } from './roles-api.interface'

export default class RolesApiService {
  static async createRole (roleInfo: TRole): Promise<TRole> {
    return await MainApiService.fetchApi('/roles/create-role', 'POST', roleInfo)
  }

  static async getRole (role_id: string): Promise<TRole> {
    return await MainApiService.fetchApi(`/roles/get-role/${role_id}`)
  }

  static async getAllRoles (): Promise<TRole[]> {
    return await MainApiService.fetchApi('/roles/get-roles')
  }

  static async updateRole (roleInfo: TRole): Promise<TRole> {
    return await MainApiService.fetchApi('/roles/update-role', 'PATCH', roleInfo)
  }

  static async deleteRole (roleInfo: { role_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/roles/delete-role', 'Delete', roleInfo)
  }

  static async getBasePermissions (): Promise<TPermission[]> {
    return await MainApiService.fetchApi('/permissions/get-base-permissions')
  }

}