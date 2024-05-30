export type TProject = {
  project_id?: string
  name?: string
  description?: string | null
  project_owner?: string
  workspace_id?: string
}

export type TProjectRole = {
  project_id?: string
  role_id?: string
  user_id?: string
}

export type TProjectUserRole = {
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
