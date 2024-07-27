import { TCustomFieldOption } from 'src/modules/custom-fields/services/custom-fields-api.interface'

export interface IProject {
  project_id?: string
  name?: string
  description?: string | null
  project_owner?: string
  workspace_id?: string
}

export interface IProjectRole {
  project_id?: string
  role_id?: string
  user_id?: string
}

export interface IProjectUserRole {
  id: string
  project_id: string
  roles: {
    name: string,
    role_id: string
    isActive?: boolean
  }[]
  user: {
    profile_name: string,
    user_id: string
  }
  isActive?: boolean
}

export interface IProjectCustomField {
  custom_field_id: string
  name: string
  can_be_empty: boolean
  options: TCustomFieldOption[]
  field_type: string
  default_value: string | null
  empty_value: string | null
  key: string
  position: number
}
