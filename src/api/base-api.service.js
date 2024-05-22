class CustomError extends Error {
  constructor (message, entity, code) {
    super(message)
    this.message = message
    this.entity = entity
    this.code = code
  }
}

const refreshUrl = '/auth/refresh'

export default class BaseApiService {
  constructor (base) {
    this.base = base
    this.refreshing = null
  }

  async refreshAccessToken () {
    const url = `${process.env.API}${refreshUrl}`
    const options = { method: 'GET', credentials: 'include' }
    const { response, result } = await this.fetch(url, options)

    if (!response.ok) {
      this.handleError({ result, response })
    }
  }

  getBody (data) {
    return JSON.stringify(data)
  }

  getHeaders (customHeaders) {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
      ...customHeaders
    }
  }

  async fetch (url, options) {
    const response = await fetch(url, options)
    if (response.status === 204) return { result: null, response }
    return { result: await response.json(), response }
  }

  async fetchApi (url, method = 'GET', data, customHeaders = {}) {
    const body = this.getBody(data)
    const headers = this.getHeaders(customHeaders)

    // replace multiple slash to single
    const pureUrl = `${this.base}/${url}`.replace(/([^:])(\/{2,})/g, '$1/')

    const options = { method, body, headers, credentials: 'include' }

    const { result, response } = await this.fetch(pureUrl, options)
    if (response.status === 401) {
      if (url === refreshUrl) throw e
      // если access_token еще не обновляется, отправляем на обновление
      if (!this.refreshing) {
        this.refreshing = this.refreshAccessToken()
      }
      // дожидаемся обновления access token
      try {
        await this.refreshing
        this.refreshing = null
      } catch (e) {
        window.location.href = '/login'
      }

      // перезапускаем запрос уже с токеном
      return await this.fetchApi(...arguments)
    }

    if (!response.ok) {
      return this.handleError({ result, response })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(response)
      console.log(result)
    }

    return result
  }

  handleError ({ result, response }) {
    throw new CustomError(result.message || result.detail, result.entity, response.statusCode)
  }
}
