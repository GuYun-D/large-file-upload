import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: '/api',
  timeout: 500000
})

request.interceptors.response.use((respone) => {
  const responeData = respone.data
  const { status, data, message } = responeData
  if (!status) {
    Message.error(message)
  } else {
    return data
  }
})

export { request }
