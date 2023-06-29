<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="70px" label-position="right">
    <div v-if="collapsePanel === '基础信息'">
      <el-form-item label="" prop="objectType">
        <el-radio-group v-model="formData.objectType" class="ml-4">
          <el-radio label="detection">目标检测</el-radio>
          <el-radio label="segmentation">目标分割</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="fileName">
        <el-input v-model="formData.fileName"/>
      </el-form-item>
      <el-form-item label="输出名称" prop="resultName">
        <el-input v-model="formData.resultName"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formData.remark"/>
      </el-form-item>
      <el-form-item label="上传图片">
        <file-upload v-model="formData.picture"></file-upload>
      </el-form-item>
    </div>
    <div v-if="collapsePanel === '处理结果'">
      <el-form-item label="结果图片">
        <img alt='' :src='formData.resultUrl' style="width: 100%" @click="handlePreview">
      </el-form-item>
      <el-dialog v-model="previewVisible" @close="handleClose">
        <img alt="example" :src="formData.resultUrl" style="width: 100%"/>
      </el-dialog>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import FileUpload from "@/components/FileUpload/index.vue";
import {UploadFile} from "element-plus";

defineOptions({
  name: 'image-form'
})
const props = defineProps({
  collapsePanel: {
    type: String,
  },
  formData: {},
  url: {
    type: Object,
  }
})

const formRef = ref()
// const {data: formData} = props
const rules = {
  // folderName: [{required: true, message: '请输入名称', trigger: 'change'}],
  // sort: [{required: true, message: '请输入0到9，最多两位小数', trigger: 'blur',}],
}
const previewVisible = ref(false)

const handlePreview = (uploadFile: UploadFile) =>{
  // console.log('uploadFile', uploadFile)
  previewVisible.value = true
  // previewImage.value = formData.
}
const handleClose = () =>{
  previewVisible.value = false
}
</script>

<style scoped>

</style>