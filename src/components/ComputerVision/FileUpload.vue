<template>
  <div style='height: 500px; width: 500px'>
    <a-upload
      :action='uploadAction'
      :headers="headers"
      :data="{biz:bizPath}"
      list-type='picture'
      :before-upload='beforeUpload'
      @change="handleChange"
    >
      <a-button><a-icon type="upload" />点击上传</a-button>
      <div>只能上传jpg/png/tif文件，且不超过2MB</div>
    </a-upload>
  </div>

</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'FileUpload',
  props:{
    bizPath:{
      type:String,
      required:false,
      default:"temp"
    },
  },
  data() {
    return {
      uploadAction:window._CONFIG['domainURL']+"/sys/common/upload",
      headers:{},
      fileList: [],
      uploadResult: '',
      // headers: {
      //   authorization: 'authorization-text',
      // },
    }
  },
  created(){
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = {"X-Access-Token":token}
  },
  methods: {
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      let isImg = false
      if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/tiff'){
        isImg = true
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('上传图片只能是 jpg/png/tif 格式!')
      }
      // if (!isLt2M) {
      //   this.$message.error('上传图片大小不能超过 2MB!')
      // }
      if (this.fileMaintain.isExistFile(file.name)) {
        this.$message.error('同名文件已存在!')
      }

      // return isImg && isLt2M && (!this.fileMaintain.isExistFile(file.name))
      return isImg && (!this.fileMaintain.isExistFile(file.name))

    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(info) {
      this.uploadResult = info.file.response
      let fileId = info.file.response && info.file.response.timestamp
      let filename = info.file.name
      let fileType = info.file.type
      let filePath = info.file.response && info.file.response.message
      if(this.uploadResult){
        if (this.uploadResult.code === 0) {
          this.fileMaintain.saveFileList(fileId, filename, fileType, filePath)
          this.$message.success("success");
        } else  {
          this.$message.error("error")
        }
      }

    },
    handleError() {
      this.$message.error('上传文件失败')
    }
  }
}
</script>

<style scoped>
/*.upload {*/
/*  margin-top: 70px;*/
/*  margin-left: 30px;*/
/*  margin-right: 30px;*/
/*  margin-bottom: 70px;*/
/*}*/
</style>