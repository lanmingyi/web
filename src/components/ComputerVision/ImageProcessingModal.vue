<template>
  <basic-modal
    :title='modal.title'
    :visible.sync='modal.visible'
    :width='1200'
    :fullscreen.sync='modal.fullscreen'
    :switchFullscreen='modal.switchFullscreen'
  >
    <!--        <div style='margin-left: 20%; margin-right: 20%'>-->
    <!--          <a-form-model :model='grayingForm' :rules='grayingFormRules'>-->
    <!--            <a-form-model-item label='输出图像名称' prop='res_name' :labelCol='labelCol' :wrapperCol='wrapperCol'>-->
    <!--              <a-input v-model='grayingForm.res_name' addon-after='.jpg' />-->
    <!--            </a-form-model-item>-->
    <!--          </a-form-model>-->
    <!--        </div>-->
    <div class='modal-content'>
      <div class="content-left">
        <span class='demonstration'>原图片</span>
        <br>
        <!-- <img :src='this.displayImg' alt='' class='content-img'>
        <img :src='this.displayImg1' alt='' class='content-img1'> -->
        <tiff :path="imgPath" :types="imgType" :size='imgSize'></tiff>
        <tiff :path="imgPath1" :types="imgType1" :size='imgSize'></tiff>
      </div>
      <div class="content-right">
        <span class='demonstration'>结果图片</span>
        <br>
        <img :src='this.processResult.result_name' alt='' class='content-img'>
        <!-- <tiff :path="imgPath" :type="imgType"></tiff> -->
      </div>
    </div>
  </basic-modal>

</template>

<script>
import tiff from '@/components/ComputerVision/tiff'
export default {
  name: 'ImageProcessingModal',
  props: {
    // displayImg: {
    //   type: String,
    // },
    // processResult: {
    //   type: Object,
    // },
  },
  components:{tiff},
  data(){
    return{
      imgPath:'',
      imgPath1: '',
      imgType:'',
      imgType1:'',
      processResult: {},
      modal: {
        title: '',
        visible: false,
        fullscreen: false,
        switchFullscreen: true
      },
      imgSize:{
        // width: 'auto',
        height: 'auto',
        'width': '360px',
        // 'height': '320px',
        'margin-top': '10px',
        'margin-bottom': '30px',
        'margin-left': '10px'
      }
    }
  },
}
</script>

<style scoped>
.modal-content {
  min-height: 500px;
  text-align: center;
  display: flex;
}
.content-right{
  margin-left: 50px;
}
.content-img {
  width: 360px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 30px
}
.content-img1{
  margin-left: 10px;
  width: 360px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 30px
}
</style>