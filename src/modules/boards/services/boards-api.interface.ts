export interface IBoard {
  board_id?: string
  name?: string
  columns_field_id?: string
  columns_options?: TBoardEnumOption[]
  rows_field_id?: string
  rows_options?: TBoardEnumOption[]
  projects?: TBoardProject[]
  workspace_id?: string
}

export type TBoardEnumOptionField = {
  id: string
  name: string
}


export type TBoardEnumOption = {
  fields: TBoardEnumOptionField[]
  position: number
}

export type TBoardProject = {
  project_id: string
}

