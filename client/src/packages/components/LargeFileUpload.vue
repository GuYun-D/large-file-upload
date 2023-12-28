<template>
  <div>
    <el-upload ref="file" :http-request="handleLoadFile" action="#" class="avatar-uploader" :show-file-list='false'>
      <slot>
        <div class="uploader">
          <i class="el-icon-upload"></i>
          <div class="tip">点击上传文件</div>
        </div>
      </slot>
    </el-upload>
  </div>
</template>

<script>
import { checkFile, upaloadFileApi, mergeFileSlicesApi } from '../api'
import { createChunk, calcSliceHash } from '../utils'
import { largeFileUploadConfig } from '../config/index'

export default {
  data() {
    return {
      hash: '',
      chunks: []
    }
  },
  methods: {
    handleLoadFile(e) {
      const file = e.file
      if (!file) {
        return
      }
      this.file = file
      this.uploadFile(this.file)
    },

    async uploadFile(file = this.file) {
      const chunkObj = createChunk(file)
      if (!chunkObj || !chunkObj.status) {
        this.$message.error(chunkObj.data)
        return
      }
      this.chunks = chunkObj.data
      const hash = await calcSliceHash(this.chunks) // 即使是修改了文件名hash值也不会发生变化，除非是修改文件内容

      this.hash = hash
      const res = await checkFile({
        hash,
        ext: this.file.name.split('.').pop()
      })

      const { upload, uploadList } = res
      if (upload) {
        return this.$message.success("上传成功")
      }


      this.chunks = this.chunks.map((item, index) => {
        const sliceName = hash + '-' + index
        const isChunkUploaded = !!uploadList.includes(sliceName)

        return {
          hash,
          index,
          name: sliceName,
          chunk: item.file,
          progress: isChunkUploaded ? 100 : 0
        }
      })
      this.uploadChunks(uploadList)

    },

    async uploadChunks(uploadList) {
      const requests = this.chunks.filter(chunk => !uploadList.includes(chunk.name)).map(chunk => {
        const form = new FormData()
        form.append('chunk', chunk.chunk)
        form.append('hash', chunk.hash)
        form.append('name', chunk.name)
        return { form, index: chunk.index, error: 0 }
      })

      const sendRequest = (limit = 1, task = []) => {
        let count = 0 // 用于记录请求成功次数
        let isStop = false // 标记切片上传错误情况，如果 >= 3 次 直接停止
        const allTackLength = requests.length
        return new Promise((resolve, reject) => {
          const uploadReq = () => {
            if (isStop) return
            const requestItem = requests.shift()
            if (!requestItem) return
            const { form } = requestItem

            upaloadFileApi(form).then(() => {
              // 最后一个切片上传成功才算成功
              if (count >= allTackLength - 1) {
                resolve()
              } else {
                count++
                uploadReq()
              }
            }).catch(() => {
              if (requestItem.error < 3) {
                requestItem.error++
                requests.unshift(requestItem)
                uploadReq()
              } else {
                isStop = true
                reject(new Error("切片上传失败"))
              }
            })
          }

          while (limit > 0) {
            uploadReq()
            limit--
          }
        })
      }

      await sendRequest(3)
      // this.$message.success("切片上传成功")
      this.mergeFileSlices()
    },

    async mergeFileSlices() {
      const res = await mergeFileSlicesApi({
        ext: this.file.name.split('.').pop(),
        size: largeFileUploadConfig.CHUNK_SIZE,
        hash: this.hash,
      })

      this.$message.success("文件上传成功")
    }
  }
}
</script>

<style>
.uploader {
  width: 300px;
  height: 100px;
  border: 1px dotted #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  border-radius: 5px;
  transition: all 350ms;

  &:hover {
    color: #409eff;
    border-color: #409eff;
  }

  .el-icon-upload {
    font-size: 36px;
  }

  .tip {
    margin-left: 5px;
  }
}
</style>