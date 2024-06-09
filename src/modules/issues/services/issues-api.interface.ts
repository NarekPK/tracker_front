export interface IIssue {
  name?: string
  description?: string
  issue_author?: string
  custom_fields_value?: []
  project_id?: string
  workspace_id?: string
  issue_id?: string
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

export interface IIssueComment {
  text?: string
  user_id?: string
  issue_id?: string
  comment_id?: string
  user?: {
    profile_name?: string
    user_id?: string
  }
  createdAt?: string
}
