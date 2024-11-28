import { IUser } from './users-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class UsersApiService {
  static async createUser (userInfo: IUser): Promise<IUser> {
    return await MainApiService.fetchApi('/users', 'POST', userInfo)
  }

  static async getMe (): Promise<IUser> {
    return await MainApiService.fetchApi('/users/me')
  }

  static async getUser (user_id: string): Promise<IUser> {
    return await MainApiService.fetchApi(`/users/${user_id}`)
  }

  static async getAllUsers (): Promise<IUser[]> {
    return await MainApiService.fetchApi('/users')
  }

  static async updateUser (user_id: string, userInfo: IUser): Promise<IUser> {
    return await MainApiService.fetchApi(`/users/${user_id}`, 'PATCH', userInfo)
  }

  static async deleteUser (user_id: string): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/users/${user_id}`, 'Delete')
  }

}
