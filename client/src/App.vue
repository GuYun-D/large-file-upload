<template>
  <div class="upload-wrap">
    <!-- <LargeFileUpload></LargeFileUpload> -->
    <BeeLargrFileUpload></BeeLargrFileUpload>
  </div>
</template>

<script>
// import LargeFileUpload from './packages/components/LargeFileUpload'
import { BeeLargrFileUpload } from './packages/dist/bee-large-file-upload.es'

export default {
  name: 'App',
  components: {
    BeeLargrFileUpload
  }
}
</script>

<style>
.upload-wrap {
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
