export interface IUser {
  email?: string
  user_name?: string
  user_id?: string
  password?: string
  confirmation_password?: string
  profile_name?: string
  lang?: TProfileLanguage
  workspace_id?: string
  createdAt?: string
}

export type TProfileLanguage = 'en-US' | 'ru'
