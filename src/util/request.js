import axios from "axios";
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'


const baseURL = '/api'
const instance = axios.create({ baseURL })



instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        // 请求错误的回调
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        if (response.data.code === 0) {

            return response.data
        } else if (response.data.code === -1) {
            ElMessage.error(response.data.msg ? response.data.msg : '服务异常')
            
        }
        return Promise.reject(response.data)
    }, error => {
        ElMessage.error('服务异常')
        
        return Promise.reject(error)
    }
)
export default instance
