import { defineStore } from 'pinia'
import { ITask } from './services/tasks-api.interface'
import { TasksApiService } from './services/'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks',() => {
  const tasks = ref<ITask[]>([])

  async function getAllTasks () {
    try {
      tasks.value = await TasksApiService.getAllTasks()
    } catch (error) {
      console.log(error)
    }
  }

  return { tasks, getAllTasks }
})
