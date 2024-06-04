import MainApiService from 'src/api/main-api.service'
import { IRole, IPermission } from './roles-api.interface'

export default class RolesApiService {
  static async createRole (roleInfo: IRole): Promise<IRole> {
    return await MainApiService.fetchApi('/roles/create-role', 'POST', roleInfo)
  }

  static async getRole (role_id: string): Promise<IRole> {
    return await MainApiService.fetchApi(`/roles/get-role/${role_id}`)
  }

  static async getAllRoles (): Promise<IRole[]> {
    return await MainApiService.fetchApi('/roles/get-roles')
  }

  static async updateRole (roleInfo: IRole): Promise<IRole> {
    return await MainApiService.fetchApi('/roles/update-role', 'PATCH', roleInfo)
  }

  static async deleteRole (roleInfo: { role_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/roles/delete-role', 'Delete', roleInfo)
  }

  static async getBasePermissions (): Promise<IPermission[]> {
    return await MainApiService.fetchApi('/permissions/get-base-permissions')
  }

}
