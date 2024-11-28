import MainApiService from 'src/api/main-api.service'
import { IBoard } from './boards-api.interface'

export default class BoardsApiService {
  static async createBoard (boardInfo: IBoard): Promise<IBoard> {
    return await MainApiService.fetchApi('/boards', 'POST', boardInfo)
  }

  static async getAllBoards (): Promise<IBoard[]> {
    return await MainApiService.fetchApi('/boards')
  }

  static async getBoard (board_id: string): Promise<IBoard> {
    return await MainApiService.fetchApi(`/boards/${board_id}`)
  }

  static async updateBoard (board_id: string, boardInfo: IBoard): Promise<IBoard> {
    return await MainApiService.fetchApi(`/boards/${board_id}`, 'PATCH', boardInfo)
  }

  static async deleteBoard (board_id: string): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi(`/boards/${board_id}`, 'DELETE')
  }

}
