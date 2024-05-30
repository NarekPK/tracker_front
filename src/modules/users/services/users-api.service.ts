import { TUser } from './users-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class UsersApiService {
  static async createUser (userInfo: TUser): Promise<TUser> {
    return await MainApiService.fetchApi('/users/create-user', 'POST', userInfo)
  }

  static async getMe (): Promise<TUser> {
    return await MainApiService.fetchApi('/users/get-me')
  }

  static async getUser (user_id: string): Promise<TUser> {
    return await MainApiService.fetchApi(`/users/get-user/${user_id}`)
  }

  static async getAllUsers (): Promise<TUser[]> {
    return await MainApiService.fetchApi('/users/get-users')
  }

  static async updateUser (userInfo: TUser): Promise<TUser> {
    return await MainApiService.fetchApi('/users/update-user', 'PATCH', userInfo)
  }

  static async deleteUser (userInfo: { user_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/users/delete-user', 'Delete', userInfo)
  }

}