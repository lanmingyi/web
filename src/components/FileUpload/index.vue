<template>
<!--  :headers="headers"-->
<!--  :action="action"-->
<!--  :data="uploadData"-->
<!--  :on-success="handleSuccess"-->
<!--  :on-preview="handlePictureCardPreview"-->
<!--  :auto-upload="false"-->

  <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      list-type="picture"
      :limit="limit"
      :disabled="disabled"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
  >
<!--    <el-icon><Plus/></el-icon>-->
    <el-button v-if="fileList.length < 6" :loading="loading" :icon="Upload" >上传</el-button>
  </el-upload>
  <el-dialog v-model="previewVisible" @close="handleClose">
    <img alt="example" style="width: 100%" :src="previewImage"/>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, toRefs} from 'vue'
import type { UploadInstance, UploadProps, UploadRawFile, UploadFile, UploadFiles  } from 'element-plus'
import {Upload,Plus} from "@element-plus/icons-vue";
import request from "@/utils/axios/index";
import {SERVER_URL} from "@/utils/axios/service";
import {ElMessage} from "element-plus";

defineOptions({
  name: 'FileUpload'
})
const props= defineProps({
  /** 是否支持多选文件*/
  multiple:{
    type:Boolean,
    default: false
  },
  /** 是否禁用*/
  disabled:{
    type: Boolean,
    default: false
  },
  /** 允许上传的最大数量*/
  limit: {
    type:Number,
    default: 10,
  },
  /** 文件列表的类型, 'text'、'picture'、'picture-card'*/
  listType:{
    type:String,
    default: 'picture'
  },
  /** 上传参数*/
  uploadParam: {
    type: Object,
    default: () => {
      return {
        biz: 'temp'
      }
    },
  },
})
const emit = defineEmits(['update:modelValue'])

const {uploadParam} = props
const fileList= ref<any[]>([])
const previewVisible = ref(false)
const previewImage = ref()
const loading = ref(false)

const handleBeforeUpload = (rawFile: UploadRawFile) =>{
  console.log('rawFile', rawFile)
  const formData = new FormData()
  formData.append("file", rawFile)
  formData.append("biz", uploadParam.biz)

  handleUpload(formData)
}
const handleUpload = (data) =>{
  loading.value = true;
  const that = this;
  request.post({url:'/sys/common/upload', data:data, headersType: 'multipart/form-data'}).then(res=>{
    if (res.code === 0) {
      // if (that.num === that.fileList.length) {
      ElMessage.success("上传成功！");
      let path = res.message
      let url = SERVER_URL+"/sys/common/static"+'/'+ path
      // console.log('url', url)
      fileList.value.push({name: path.split('/')[1], url: url, path: path});
      console.log('that.fileList', fileList.value)
      let modelValue = fileList.value.map(item=>item.path).join()
      emit('update:modelValue', modelValue)
      // console.log('modelValue', modelValue)
      loading.value = false;
      // }
    } else {
      ElMessage.error(res.message);
      loading.value = false;
    }
  }).finally(()=>{
    loading.value = false
  })
}
const handlePreview = (uploadFile: UploadFile) =>{
  // console.log('uploadFile', uploadFile)
  previewVisible.value = true
  previewImage.value = uploadFile.url
}

const handleRemove = (uploadFile, uploadFiles) =>{
  console.log(uploadFile, uploadFiles)
}

const handleClose = () =>{
  previewVisible.value = false
}


</script>

<style scoped>

</style>