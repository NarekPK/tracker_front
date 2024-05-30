import MainApiService from 'src/api/main-api.service'
import { TProject, TProjectRole, TProjectUserRole } from './projects-api.interface'

export default class ProjectsApiService {
  static async createProject (projectInfo: TProject): Promise<TProject> {
    return await MainApiService.fetchApi('/projects/create-project', 'POST', projectInfo)
  }

  static async getProject (project_id: string): Promise<TProject> {
    return await MainApiService.fetchApi(`/projects/get-project/${project_id}`)
  }

  static async getAllProjects (): Promise<TProject[]> {
    return await MainApiService.fetchApi('/projects/get-projects')
  }

  static async updateProject (projectInfo: TProject): Promise<TProject> {
    return await MainApiService.fetchApi('/projects/update-project', 'PATCH', projectInfo)
  }

  static async deleteProject (projectInfo: { project_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/projects/delete-project', 'DELETE', projectInfo)
  }

  static async getProjectRoles (project_id: string): Promise<TProjectUserRole[]> {
    return await MainApiService.fetchApi(`/projects/get-project-roles/${project_id}`)
  }

  static async addProjectRole (projectRoleInfo: TProjectRole): Promise<{ created: boolean }> {
    return await MainApiService.fetchApi('/projects/create-project-role', 'POST', projectRoleInfo)
  }

  static async deleteProjectRoles (projectRolesInfo: TProjectUserRole[]): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/projects/delete-project-roles', 'DELETE', projectRolesInfo)
  }

}