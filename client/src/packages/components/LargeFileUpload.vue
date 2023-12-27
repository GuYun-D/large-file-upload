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
import { checkFile } from '../api'
import { createChunk, calcSliceHash } from '../utils'
export default {
  data() {
    return {
      hash: ''
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
      const chunks = chunkObj.data
      const hash = await calcSliceHash(chunks) // 即使是修改了文件名hash值也不会发生变化，除非是修改文件内容
      this.hash = hash
      try {
        const res = await checkFile({
          hash,
          ext: this.file.name.split('.').pop()
        })

        console.log("来了老弟啊", res);
      } catch (error) {

      }
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