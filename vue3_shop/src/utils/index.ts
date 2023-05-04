import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const service = axios.create({
    // 此接口似乎暂时报废
    baseURL: 'http://43.143.0.76:8889/api/private/v1/',
    timeout: 3000
})

service.interceptors.request.use(
    config => {
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service