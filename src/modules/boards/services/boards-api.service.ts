import MainApiService from 'src/api/main-api.service'
import { IBoard } from './boards-api.interface'

export default class BoardsApiService {
  static async createBoard (boardInfo: IBoard): Promise<IBoard> {
    return await MainApiService.fetchApi('/boards/create-board', 'POST', boardInfo)
  }

  static async getBoard (board_id: string): Promise<IBoard> {
    return await MainApiService.fetchApi(`/boards/get-board/${board_id}`)
  }

  static async getAllBoards (): Promise<IBoard[]> {
    return await MainApiService.fetchApi('/boards/get-boards')
  }

  static async updateBoard (boardInfo: IBoard): Promise<IBoard> {
    return await MainApiService.fetchApi('/boards/update-board', 'PATCH', boardInfo)
  }

  static async deleteBoard (boardInfo: { board_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/boards/delete-board', 'DELETE', boardInfo)
  }

}
