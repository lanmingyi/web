<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="70px" label-position="right">
    <div v-if="collapsePanel === '基础信息'">
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
<!--      <el-form-item label="结果图片">-->
<!--        <img :src='processResult.resultName' alt='' class='content-img'>-->
<!--      </el-form-item>-->
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import FileUpload from "@/components/FileUpload/index.vue";

defineOptions({
  name: 'landslide-form'
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
const processResult= reactive({
  resultName:''
})

</script>

<style scoped>

</style>