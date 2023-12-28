import { request } from '../utils/index'

/**
 * 查看该文件是否存在
 */
export const checkFile = (data) => {
  return request.post('/checkFileExist', data)
}

/**
 * 上传切片
 */
export const upaloadFileApi = (data) => {
  return request.post('/uploadfile', data)
}

/**
 * 合并文件夹
 */
export const mergeFileSlicesApi = (data) => {
  return request.post('/mergeFile', data)
}
