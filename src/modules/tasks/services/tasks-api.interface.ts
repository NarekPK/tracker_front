export interface ITask {
  name?: string
  description?: string
  task_author?: string
  custom_fields_value?: []
  project_id?: string
  workspace_id?: string
  task_id?: string
  project?: {
    name?: string
    project_id?: string
  }
  user?: {
    profile_name?: string
    user_id?: string
  }
  createdAt?: string
  updatedAt?: string
}
