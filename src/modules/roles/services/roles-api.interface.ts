export type TRole = {
  role_id?: string
  name?: string
  description?: string | null
  permissions?: string[]
  workspace_id?: string
}

export type TRelatedPermission = {
  permission_key: string
  permission_id: string
  name: string
}

export type TPermission = {
  permission_key: string
  permission_id: string
  name: string
  description: string
  global: boolean
  entity_type: string
  operation: string
  dependent_permissions: TRelatedPermission[]
  implied_permissions: TRelatedPermission[]
  isActive?: boolean
}
