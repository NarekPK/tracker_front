import { ITask } from './tasks-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class TasksApiService {
  static async createTask (taskInfo: ITask): Promise<ITask> {
    return await MainApiService.fetchApi('/tasks/create-task', 'POST', taskInfo)
  }

  static async getMe (): Promise<ITask> {
    return await MainApiService.fetchApi('/tasks/get-me')
  }

  static async getTask (task_id: string): Promise<ITask> {
    return await MainApiService.fetchApi(`/tasks/get-task/${task_id}`)
  }

  static async getAllTasks (): Promise<ITask[]> {
    return await MainApiService.fetchApi('/tasks/get-tasks')
  }

  static async updateTask (taskInfo: ITask): Promise<ITask> {
    return await MainApiService.fetchApi('/tasks/update-task', 'PATCH', taskInfo)
  }

  static async deleteTask (taskInfo: { task_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/tasks/delete-task', 'Delete', taskInfo)
  }

}
