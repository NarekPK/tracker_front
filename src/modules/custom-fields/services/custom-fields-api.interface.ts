export interface ICustomField {
  custom_field_id: string
  name: string
  can_be_empty: boolean
  options: TCustomFieldOption[]
  field_type: string
  default_value: string | null
  empty_value: string | null
  key: string
  project_custom_fields: {
    project_id: string
    position: number
  }[]
}

export type TCustomFieldOption = {
  id: string
  name: string
}
