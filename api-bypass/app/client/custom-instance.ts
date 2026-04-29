import axios, { type AxiosRequestConfig } from 'axios'
import env from '#start/env'

const instance = axios.create({ baseURL: env.get('API_PETS_URL') })

instance.interceptors.request.use((config) => {
  const token = env.get('API_TOKEN')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await instance(config)
  return response as unknown as T
}

export default instance
