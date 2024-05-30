import { defineStore } from 'pinia'
import { TProject, TProjectUserRole /* TPermission */} from './services/projects-api.interface'
import { ProjectsApiService } from './services/'
import { ref } from 'vue'

export const useProjectsStore = defineStore('projects',() => {
  const project = ref<TProject | null>(null)
  const projectRoles = ref<TProjectUserRole[] | []>([])

  async function getProject (project_id: string) {
    try {
      project.value = await ProjectsApiService.getProject(project_id)
    } catch (error) {
      console.log(error)
    }
  }

  async function getProjectRoles (project_id: string) {
    try {
      projectRoles.value = await ProjectsApiService.getProjectRoles(project_id)
    } catch (error) {
      console.log(error)
    }
  }

  return { project, projectRoles, getProject, getProjectRoles }
})
