import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const clientApi = applyCaseMiddleware(
  axios.create({
    baseURL: 'https://avatars.axas.ru/api/v1',
  }),
)
clientApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default clientApi
