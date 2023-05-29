<template>
  <div>
    <div class='table-operator' style='border-top: 5px'>
      <el-button type='primary' style='margin-right: 8px;' @click='showForm(url.unet, 1)'>UNet</el-button>
    </div>
    <div class='' v-show='pictureShow'>
      <!--      <PictureChooseOne ref='pictureSelection' />-->
      <Table ref="pictureSelectionRef">

      </Table>

    </div>
    <div v-show='formShow'>
      <div class='step-content' style='margin-left: 20%; margin-right: 20%'>
        <el-form :model='formData'>
          <el-form-item label='输出图像名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <el-input v-model='formData.res_name' addon-after='.jpg'/>
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
import {ElMessage} from "element-plus";
import Table from '@/components/Table/index.vue'
import PictureChooseOne from '@/components/ComputerVision/PictureChooseOne'
import FileUpload from '@/components/ComputerVision/FileUpload'
import ImageProcessingModal from '@/components/ComputerVision/ImageProcessingModal'
import axios from 'axios'
import {defineOptions} from "unplugin-vue-define-options/macros";

defineOptions({
  name: 'LandslideDetection'
})

const activeKey = ref('1')
const drawer = ref(false)
const url = reactive({
  unet: '/landslide/daUnet'
})

const pictureSelectionRef = ref()

const selection = ref<any[]>([])
const displayImg = ''
const displayImg1 = ''
const pictureShow = true
const formShow = false
const labelCol = {xs: {span: 24}, sm: {span: 5}}
const wrapperCol = {xs: {span: 24}, sm: {span: 16}}
const formData = {}
const formUrl = ''
const type = 1

const  daUnet = async(url, type, param)=> {
  selection.value = pictureSelectionRef.value.multipleSelection
  if (type === 1) {
    if (selection.value.length !== 1) {
      ElMessage.warning({title: '数量错误', content: '选择的图片数量不是一张！', okText: '确定'})
      return
    }
    this.$refs.modalForm.modal.visible = true
    this.$refs.modalForm.imgPath = selection.value[0].filePath
    this.$refs.modalForm.imgType = selection.value[0].fileType
    let res_name = this.utils.calculate_res_name(this.formData.res_name, selection.value[0].fileType)
    console.log('res_name1', res_name)
    console.log('selection.value[0].fileType', selection.value[0].fileType)

    let resultName = this.formData.res_name !== '' ? res_name : selection.value[0].fileName
    const axios = require('axios')
    await axios.get(
        window._CONFIG['algorithmURL'] + url, {
          params: {
            img_name: selection.value[0].filePath,
            result_name: resultName,
            ...param
          }
        }
    ).then((res) => {
          this.$refs.modalForm.processResult = {}
          this.$refs.modalForm.processResult = res.data
          if (res.data.code === '1') {
            ElMessage.success('图片处理成功！')
          } else if (res.data.code === '2') {
            ElMessage.error('图片处理失败！')
          }
        }
    )
  } else if (type === 2) {
    if (selection.value.length !== 2) {
      ElMessage.warning({title: '数量错误', content: '选择的图片数量不是两张！', okText: '确定'})
      return
    }
    this.$refs.modalForm.modal.visible = true
    this.$refs.modalForm.imgPath = selection.value[0].filePath
    this.$refs.modalForm.imgPath1 = selection.value[1].filePath
    this.$refs.modalForm.imgType = selection.value[0].fileType
    this.$refs.modalForm.imgType1 = selection.value[1].fileType
    let res_name = this.utils.calculate_res_name(this.formData.res_name)
    let resultName = this.formData.res_name !== '' ? res_name : selection.value[0].fileName
    const axios = require('axios')
    await axios.get(
        window._CONFIG['algorithmURL'] + url, {
          params: {
            img_name1: selection.value[0].filePath,
            img_name2: selection.value[1].filePath,
            result_name: resultName,
            ...param
          }
        }
    ).then((res) => {
          this.$refs.modalForm.processResult = {}
          this.$refs.modalForm.processResult = res.data
          this.processResult = res.data
          if (res.data.code === '1') {
            ElMessage.success('图片处理成功！')
          } else if (res.data.code === '2') {
            ElMessage.error('图片处理失败！')
          }
        }
    )
  }
}

export default {
  methods: {
    onClose() {
      this.drawer = false
    },
    cancel() {
      selection.value = []
      this.displayImg = ''
      this.displayImg1 = ''
      this.pictureShow = true
      this.formShow = false
      this.formData.res_name = ''
    },
    

    showForm(url, type) {
      this.formUrl = url
      this.type = type
      this.pictureShow = false
      this.formShow = true
    }
  }
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