<template>
  <div>
    <div class='table-operator' style='border-top: 5px'>
      <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.unet, 1)'>UNet</el-button>
    </div>
    <div class='' v-show='pictureShow'>
      <!--      <PictureChooseOne ref='pictureSelection' />-->
      <Table
          ref="pictureSelectionRef"
          :columns="columns"
      >
        <template #filePreview="{scope}">
          <tiff :path="scope.row.filePath" :types="scope.row.fileType"></tiff>
        </template>

      </Table>
    </div>
    <div v-show='formShow'>
      <div class='step-content' style='margin-left: 20%; margin-right: 20%'>
        <el-form :model='formData'>
          <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <el-input v-model='formData.resultName' addon-after='.jpg'/>
          </el-form-item>
        </el-form>
      </div>
      <el-button style='margin-left: 80%; margin-top: 10px;' @click='cancel'>取消</el-button>
      <el-button type='primary' style='margin-left: 10px; margin-top: 10px;' @click='daUnet(formUrl, type, formData)'>
        处理图像
      </el-button>
    </div>
    <el-button slot='tabBarExtraContent' type='primary' @click='drawer = true'
               style='position: fixed; top: 70px; right: 20px; z-index:100'>
      上传图片
    </el-button>

    <el-drawer
        title='上传图片'
        :closable='false'
        :visible='drawer'
        width='600'
        @close='onClose'
    >
      <FileUpload/>
    </el-drawer>

    <image-processing-modal
        ref='modalForm'
    ></image-processing-modal>
  </div>

</template>

<script setup lang="ts">
import {defineComponent, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus";
import Table from '@/components/Table/index.vue'
import PictureChooseOne from '@/components/ComputerVision/PictureChooseOne'
import FileUpload from '@/components/ComputerVision/FileUpload'
import ImageProcessingModal from '@/components/ComputerVision/ImageProcessingModal'
import request from "@/utils/axios";
import tiff from '@/components/ComputerVision/tiff'

defineOptions({
  name: 'LandslideDetection'
})

const columns = [
  {label: "图片名称", prop: "fileName", align: "center", },
  {label: "图片类型", prop: "fileType", align: "center", },
  {label: "图片预览", prop: "filePreview", align: "center"},
]

const activeKey = ref('1')
const drawer = ref(false)
const url = reactive({
  unet: '/landslide/daUnet'
})

const pictureSelectionRef = ref()
const selection = ref<any[]>([])
const pictureShow = ref(true)
const formShow = ref(false)
const labelCol = {xs: {span: 24}, sm: {span: 5}}
const wrapperCol = {xs: {span: 24}, sm: {span: 16}}
const formData = reactive({
  resultName: ''
})
let formUrl = ''
const type = ref(1)
const modalForm = ref()

const  daUnet = async(url, type, param)=> {
  selection.value = pictureSelectionRef.value.multipleSelection
  if (type.value === 1) {
    if (selection.value.length !== 1) {
      ElMessageBox({title: '数量错误', message: '选择的图片数量不是一张！'})
      return
    }
    modalForm.value.modal.visible = true
    modalForm.value.imgPath = selection.value[0].filePath
    modalForm.value.imgType = selection.value[0].fileType

    console.log('selection.value[0].fileType', selection.value[0].fileType)

    let resultName = formData.resultName
    let params =  {
      img_name: selection.value[0].filePath,
      result_name: resultName,
      ...param
    }
    request.get<any>({url:url,params: params}).then(res=>{
      modalForm.value.processResult = {}
      modalForm.value.processResult = res.data
      if (res.data.code === '1') {
        ElMessage.success('图片处理成功！')
      } else if (res.data.code === '2') {
        ElMessage.error('图片处理失败！')
      }
    })
  } else if (type.value === 2) {
    if (selection.value.length !== 2) {
      ElMessageBox({title: '数量错误', message: '选择的图片数量不是两张！'})
      return
    }
    modalForm.value.modal.visible = true
    modalForm.value.imgPath = selection.value[0].filePath
    modalForm.value.imgPath1 = selection.value[1].filePath
    modalForm.value.imgType = selection.value[0].fileType
    modalForm.value.imgType1 = selection.value[1].fileType

    let resultName = formData.resultName
    let params = {
      img_name1: selection.value[0].filePath,
      img_name2: selection.value[1].filePath,
      result_name: resultName,
      ...param
    }

    request.get<any>({url:url,params: params}).then(res=>{
      modalForm.value.processResult = {}
      modalForm.value.processResult = res.data
      if (res.data.code === '1') {
        ElMessage.success('图片处理成功！')
      } else if (res.data.code === '2') {
        ElMessage.error('图片处理失败！')
      }
    })
  }
}

const onClose = () => {
  drawer.value = false
}

const cancel = () =>  {
  selection.value = []
  pictureShow.value = true
  formShow.value = false
  formData.resultName = ''
}

const showForm = (url, type) => {
  formUrl = url
  type.value = type
  pictureShow.value = false
  formShow.value = true
}
</script>

<style scoped>
.steps {
  margin-top: 20px;
  margin-bottom: 40px;
}

.step-content {
  margin-top: 20px;
  min-height: 500px;
  text-align: center;
}

.content-img {
  width: auto;
  height: auto;
  max-width: 640px;
  max-height: 480px;
  margin-top: 30px
}

.content-img1 {
  margin-left: 10px;
  width: auto;
  height: auto;
  max-width: 640px;
  max-height: 480px;
  margin-top: 30px
}

.labelStyle {
  font-weight: bold;
  text-align: left;
}
</style>