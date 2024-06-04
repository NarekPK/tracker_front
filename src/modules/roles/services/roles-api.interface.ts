export interface IRole {
  role_id?: string
  name?: string
  description?: string | null
  permissions?: string[]
  workspace_id?: string
}

export interface IRelatedPermission {
  permission_key: string
  permission_id: string
  name: string
}

export interface IPermission {
  permission_key: string
  permission_id: string
  name: string
  description: string
  global: boolean
  entity_type: string
  operation: string
  dependent_permissions: IRelatedPermission[]
  implied_permissions: IRelatedPermission[]
  isActive?: boolean
}
