import { request } from "../utils/index";

/**
 * 查看该文件是否存在
 */
export const checkFile = (data) => {
  return request.post("/checkFileExist", data);
};
