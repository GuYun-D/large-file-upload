<template>
  <div class="upload-wrap">
    <LargeFileUpload></LargeFileUpload>
  </div>
</template>

<script>
import LargeFileUpload from './packages/components/LargeFileUpload'

export default {
  name: 'App',
  components: {
    LargeFileUpload
  }
}
</script>

<style>
.upload-wrap{
  width: 600px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
