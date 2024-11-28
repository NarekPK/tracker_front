import { IIssue, IIssueCreate, IIssueUpdate, IIssueComment } from './issues-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class IssuesApiService {
  static async createIssue (issueInfo: IIssueCreate): Promise<IIssue> {
    return await MainApiService.fetchApi('/issues', 'POST', issueInfo)
  }

  static async getMe (): Promise<IIssue> {
    return await MainApiService.fetchApi('/issues/get-me')
  }

  static async getIssue (issue_id: string): Promise<IIssue> {
    return await MainApiService.fetchApi(`/issues/${issue_id}`)
  }

  static async getAllIssues (): Promise<IIssue[]> {
    return await MainApiService.fetchApi('/issues')
  }

  static async getProjectIssues (project_id: string): Promise<IIssue[]> {
    return await MainApiService.fetchApi(`/issues/project/${project_id}`)
  }

  static async updateIssue (issue_id: string, issueInfo: IIssueUpdate): Promise<IIssue> {
    return await MainApiService.fetchApi(`/issues/${issue_id}`, 'PATCH', issueInfo)
  }

  static async deleteIssue (issue_id: string): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/issues/${issue_id}`, 'Delete')
  }

  static async addIssueComment (issueCommentInfo: IIssueComment): Promise<IIssueComment> {
    return await MainApiService.fetchApi('/issues-comments', 'POST', issueCommentInfo)
  }

  static async getIssueComments (issue_id: string): Promise<IIssueComment[]> {
    return await MainApiService.fetchApi(`/issues-comments/issue/${issue_id}`)
  }

  static async updateIssueComment (comment_id: string, commentInfo: IIssueComment): Promise<IIssueComment> {
    return await MainApiService.fetchApi(`/issues-comments/${comment_id}`, 'PATCH', commentInfo)
  }

  static async deleteIssueComment (comment_id: string): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/issues-comments/${comment_id}`, 'Delete')
  }

  // static async updateIssueCustomFieldValue (fieldInfo: IIssueCustomField[]): Promise<IIssueCustomField> {
  //   return await MainApiService.fetchApi('/issues-comments/update-comment', 'PATCH', fieldInfo)
  // }

}
