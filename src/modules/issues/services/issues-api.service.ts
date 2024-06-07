import { IIssue } from './issues-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class IssuesApiService {
  static async createIssue (issueInfo: IIssue): Promise<IIssue> {
    return await MainApiService.fetchApi('/issues/create-issue', 'POST', issueInfo)
  }

  static async getMe (): Promise<IIssue> {
    return await MainApiService.fetchApi('/issues/get-me')
  }

  static async getIssue (issue_id: string): Promise<IIssue> {
    return await MainApiService.fetchApi(`/issues/get-issue/${issue_id}`)
  }

  static async getAllIssues (): Promise<IIssue[]> {
    return await MainApiService.fetchApi('/issues/get-issues')
  }

  static async updateIssue (issueInfo: IIssue): Promise<IIssue> {
    return await MainApiService.fetchApi('/issues/update-issue', 'PATCH', issueInfo)
  }

  static async deleteIssue (issueInfo: { issue_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/issues/delete-issue', 'Delete', issueInfo)
  }

}
