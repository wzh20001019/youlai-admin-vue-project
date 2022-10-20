import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { localStorage } from '@/utils/storage'
import useStore from '@/store'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 请求数据时的加载动画
let loadingInstance: any = null

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      )
    }

    const { user } = useStore()
    if (user.token) {
      config.headers.Authorization = `${localStorage.get('token')}`
    }

    // 请求时加载动画
    loadingInstance = ElLoading.service({
      fullscreen: true,
      // 动画中的文字
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response) {
      loadingInstance.close()
    }

    const { code, msg } = response.data

    if (code !== 200) {
      return ElMessageBox.alert(response.data.msg, '提示', {
        confirmButtonText: '确定',
        callback: () => {
          console.log('response: ' + '错误')
        },
      })
    }

    if (code === '00000') {
      return response.data
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response
      }

      ElMessage({
        message: msg || '系统出错',
        type: 'error',
      })
      return Promise.reject(new Error(msg || 'Error'))
    }
  },
  (error) => {
    if (error) {
      loadingInstance.close()
    }

    const { code, msg } = error.response.data
    if (code === 'A0230') {
      // token 过期
      localStorage.clear() // 清除浏览器全部缓存

      window.location.href = '/' // 跳转登录页

      ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {})
    } else if (code == 'B0210') {
      // 系统限流
      return error.response.data
    } else {
      ElMessage({
        message: msg || '系统出错',
        type: 'error',
      })
    }
    return Promise.reject(new Error(msg || 'Error'))
  }
)

// 导出 axios 实例
export default service
