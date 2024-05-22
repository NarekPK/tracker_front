import { TAuthInfo } from './auth-api.interface'
import { TUser } from 'src/modules/users/services/users-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class AuthApiService {
  static async register (authInfo: TAuthInfo): Promise<TUser> {
    return await MainApiService.fetchApi('/auth/register', 'POST', authInfo)
  }

  static async login (authInfo: TAuthInfo): Promise<TUser> {
    return await MainApiService.fetchApi('/auth/login', 'POST', authInfo)
  }

  static async logout (): Promise<TUser> {
    return await MainApiService.fetchApi('/auth/logout')
  }

  static async refresh (): Promise<{ refresh: boolean }> {
    return await MainApiService.fetchApi('/auth/refresh')
  }

}