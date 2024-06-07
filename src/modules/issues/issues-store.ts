import { defineStore } from 'pinia'
import { IIssue } from './services/issues-api.interface'
import { IssuesApiService } from './services/'
import { ref } from 'vue'

export const useIssuesStore = defineStore('issues',() => {
  const issues = ref<IIssue[]>([])

  async function getAllIssues () {
    try {
      issues.value = await IssuesApiService.getAllIssues()
    } catch (error) {
      console.log(error)
    }
  }

  return { issues, getAllIssues }
})
