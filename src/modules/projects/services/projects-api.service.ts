import MainApiService from 'src/api/main-api.service'
import { IProject, IProjectRole, IProjectUserRole, IProjectCustomField } from './projects-api.interface'

export default class ProjectsApiService {
  static async createProject (projectInfo: IProject): Promise<IProject> {
    return await MainApiService.fetchApi('/projects/create-project', 'POST', projectInfo)
  }

  static async getProject (project_id: string): Promise<IProject> {
    return await MainApiService.fetchApi(`/projects/get-project/${project_id}`)
  }

  static async getAllProjects (): Promise<IProject[]> {
    return await MainApiService.fetchApi('/projects/get-projects')
  }

  static async updateProject (projectInfo: IProject): Promise<IProject> {
    return await MainApiService.fetchApi('/projects/update-project', 'PATCH', projectInfo)
  }

  static async deleteProject (projectInfo: { project_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/projects/delete-project', 'DELETE', projectInfo)
  }

  static async getProjectRoles (project_id: string): Promise<IProjectUserRole[]> {
    return await MainApiService.fetchApi(`/projects/get-project-roles/${project_id}`)
  }

  static async addProjectRole (projectRoleInfo: IProjectRole): Promise<{ created: boolean }> {
    return await MainApiService.fetchApi('/projects/create-project-role', 'POST', projectRoleInfo)
  }

  static async deleteProjectRoles (projectRolesInfo: IProjectUserRole[]): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/projects/delete-project-roles', 'DELETE', projectRolesInfo)
  }

  static async getProjectCustomFields (project_id: string): Promise<IProjectCustomField[]> {
    return await MainApiService.fetchApi(`/projects/get-project-custom-fields/${project_id}`)
  }

}
