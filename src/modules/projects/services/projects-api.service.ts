import MainApiService from 'src/api/main-api.service'
import { IProject, IProjectRole, IProjectUserRole, IProjectCustomField } from './projects-api.interface'

export default class ProjectsApiService {
  static async createProject (projectInfo: IProject): Promise<IProject> {
    return await MainApiService.fetchApi('/projects', 'POST', projectInfo)
  }

  static async getProject (project_id: string): Promise<IProject> {
    return await MainApiService.fetchApi(`/projects/${project_id}`)
  }

  static async getAllProjects (): Promise<IProject[]> {
    return await MainApiService.fetchApi('/projects')
  }

  static async updateProject (project_id: string, projectInfo: IProject): Promise<IProject> {
    return await MainApiService.fetchApi(`/projects/${project_id}`, 'PATCH', projectInfo)
  }

  static async deleteProject (project_id: string): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/projects/${project_id}`, 'DELETE')
  }

  static async getProjectRoles (project_id: string): Promise<IProjectUserRole[]> {
    return await MainApiService.fetchApi(`/projects/${project_id}/roles`)
  }

  static async addProjectRole (project_id: string, projectRoleInfo: IProjectRole): Promise<{ created: boolean }> {
    return await MainApiService.fetchApi(`/projects/${project_id}/roles`, 'POST', projectRoleInfo)
  }

  static async deleteProjectRoles (project_id: string, projectRolesInfo: IProjectUserRole[]): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/projects/${project_id}/roles`, 'DELETE', projectRolesInfo)
  }

  static async getProjectCustomFields (project_id: string): Promise<IProjectCustomField[]> {
    return await MainApiService.fetchApi(`/projects/${project_id}/custom-fields`)
  }

}
