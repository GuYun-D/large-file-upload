import SparkMD5 from "spark-md5";
import { largeFileUploadConfig } from "../config/index";

/**
 * 创建切片
 * @param {File} file
 */
export const createChunk = (file) => {
  if (!(file instanceof File)) {
    return {
      status: 0,
      data: "请传递文件类型",
    };
  }

  let ids = 0;
  const CHUNK_SIZE = largeFileUploadConfig.CHUNK_SIZE;
  const chunks = [];
  const sliceLength = Math.ceil(file.size / CHUNK_SIZE);

  while (ids < sliceLength) {
    const start = ids * CHUNK_SIZE;
    const end = start + CHUNK_SIZE > file.size ? file.size : start + CHUNK_SIZE;
    chunks.push({ index: ids, file: file.slice(start, end) });
    ids++;
  }

  return {
    status: 1,
    data: chunks,
  };
};

/**
 * 给该文件创建一个hash值
 * @param {Array} chunks
 */
export const calcSliceHash = (chunks) => {
  let hash = null;
  const spark = new SparkMD5.ArrayBuffer();
  const chunkLength = chunks.length;
  const startTime = new Date().getTime();
  let count = 0;
  return new Promise((resolve, reject) => {
    const loadNext = (index) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunks[index].file);
      reader.onload = function (e) {
        const endTime = new Date().getTime();
        chunks[count] = { ...chunks[count], time: endTime - startTime };
        count++;
        spark.append(e.target.result);
        if (count === chunkLength) {
          hash = spark.end();
          resolve(hash);
        } else {
          loadNext(++index);
        }
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.onabort = function (reason) {
        reject(reason);
      };
    };

    loadNext(0);
  });
};
