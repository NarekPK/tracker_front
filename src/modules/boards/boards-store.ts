import { defineStore } from 'pinia'
import { IBoard } from './services/boards-api.interface'
import { BoardsApiService } from './services/'
import { ref } from 'vue'

export const useBoardsStore = defineStore('boards',() => {
  const board = ref<IBoard | null>(null)

  async function getBoard (board_id: string) {
    try {
      board.value = await BoardsApiService.getBoard(board_id)
    } catch (error) {
      console.log(error)
    }
  }

  return { board, getBoard }
})
