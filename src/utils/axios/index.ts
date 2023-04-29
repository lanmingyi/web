import {service} from './service'
import {config} from './config'
import {getToken} from "@/utils/cache/cookies"

const {default_headers} = config
const token = getToken()

const request = <T>(option: any): Promise<T> => {
    const {url, method, params, data, headersType, responseType} = option
    return service({
        url: url,
        method,
        params,
        data,
        responseType: responseType,
        headers: {
            'Content-Type': headersType || default_headers,
            'X-Access-Token': token
        }
    })
}
export default {
    get: <T = any>(option: any): Promise<T> => {
        return request({method: 'get', ...option})
    },
    post: <T = any>(option: any): Promise<T> => {
        return request({method: 'post', ...option})
    },
    delete: <T = any>(option: any) => {
        return request({method: 'delete', ...option}) as unknown as T
    },
    put: <T = any>(option: any) => {
        return request({method: 'put', ...option}) as unknown as T
    }
}
