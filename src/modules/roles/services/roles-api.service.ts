import MainApiService from 'src/api/main-api.service'
import { IRole, IPermission } from './roles-api.interface'

export default class RolesApiService {
  static async createRole (roleInfo: IRole): Promise<IRole> {
    return await MainApiService.fetchApi('/roles', 'POST', roleInfo)
  }

  static async getRole (role_id: string): Promise<IRole> {
    return await MainApiService.fetchApi(`/roles/${role_id}`)
  }

  static async getAllRoles (): Promise<IRole[]> {
    return await MainApiService.fetchApi('/roles')
  }

  static async updateRole (role_id: string, roleInfo: IRole): Promise<IRole> {
    return await MainApiService.fetchApi(`/roles/${role_id}`, 'PATCH', roleInfo)
  }

  static async deleteRole (roleInfo: { role_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/roles/delete-role', 'Delete', roleInfo)
  }

  static async getBasePermissions (): Promise<IPermission[]> {
    return await MainApiService.fetchApi('/permissions')
  }

}
