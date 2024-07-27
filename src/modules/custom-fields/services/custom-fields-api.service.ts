import { ICustomField } from './custom-fields-api.interface'
import MainApiService from 'src/api/main-api.service'

export default class CustomFieldsApiService {
  static async getAllCustomFields (): Promise<ICustomField[]> {
    return await MainApiService.fetchApi('/custom-fields/get-all-custom-fields')
  }

  static async deleteCustomField (fieldInfo: { custom_field_id: string }): Promise<{ deleted: boolean }> {
    return await MainApiService.fetchApi('/custom-fields/delete-custom-field', 'Delete', fieldInfo)
  }
}
