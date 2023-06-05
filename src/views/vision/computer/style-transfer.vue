<template>
  <div>
    <div>
      <el-button type='primary' @click='loadModel' style='margin-right: 5px'>
        加载模型
      </el-button>
      <el-button type='primary' @click='generateStylizeImg' :disabled='disabled'>
        风格化
      </el-button>
    </div>
    <div v-loading="loading" style='margin-top: 10px; display: flex; justify-content: center'>
      <div style='margin-right: 100px'>
        <img ref='contentImgRef' class='contentImg' :src='contentImg'/>
        <el-select class='select' @change='changeContentImg' placeholder='请选择内容图像'>
          <el-option v-for='(item,key) in contentImgList' :key='key' :value='item'>{{ item }}</el-option>
        </el-select>
      </div>
      <div>
        <img ref='styleImgRef' class='styleImg' :src='styleImg'/>
        <el-select class='select' @change='changeStyleImg' placeholder='请选择风格图像'>
          <el-option v-for='(item,key) in styleImgList' :key='key' :value='item'>{{ item }}</el-option>
        </el-select>
      </div>
    </div>
    <div class='canvas'>
      <canvas ref='stylizedRef' style='margin: auto; display: block;'></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import * as tf from '@tensorflow/tfjs'
import {ElMessage} from "element-plus";
// https://github.com/reiinakano/arbitrary-image-stylization-tfjs

const loading = ref(false)
const contentImgList = ['chicago', 'stata', 'beach', 'golden_gate']
const styleImgList = ['seaport', 'towers']
const contentImg = ref(new URL('@/assets/images/style_transfer/chicago.jpg', import.meta.url).href)
const styleImg = ref(new URL('@/assets/images/style_transfer/seaport.jpg', import.meta.url).href)
const stylizeImg = ''
const styleWeights = '/models/style/saved_model_style_inception_js/model.json'
const transformWeights = '/models/style/saved_model_transformer_separable_js/model.json'
const model = ''
const styleRatio = ref(1.0)

const disabled = ref(true)
const styleModel = ref()
const transformModel = ref()
const styleImgRef = ref()
const contentImgRef = ref()
const stylizedRef = ref()

const changeContentImg = (e) => {
  contentImg.value = new URL(`@/assets/images/style_transfer/${e}.jpg`, import.meta.url).href
}

const changeStyleImg = (e) => {
  styleImg.value = new URL(`@/assets/images/style_transfer/${e}.jpg`, import.meta.url).href
}

const loadModel = () => {
  loading.value = true
  try {
    tf.loadGraphModel(styleWeights).then(model => {
      styleModel.value = model
    })

    tf.loadGraphModel(transformWeights).then(model => {
      transformModel.value = model

      loading.value = false
      ElMessage.success({message: '加载成功', duration: 1500})
      disabled.value = false
    })
  } catch (err) {
    console.log(err)
  }
}

const generateStylizeImg = (e) => {
  // await tf.nextFrame()
  // this.styleButton.textContent = 'Generating 100D style representation'
  // await tf.nextFrame()
  let bottleneck = tf.tidy(() => {
    return styleModel.value.predict(tf.browser.fromPixels(styleImgRef.value).toFloat().div(tf.scalar(255)).expandDims())
  })
  // console.log('bottleneck', bottleneck)
  if (styleRatio.value !== 1.0) {
    // this.styleButton.textContent = 'Generating 100D identity style representation';
    // await tf.nextFrame();
    const identityBottleneck = tf.tidy(() => {
      return styleModel.value.predict(tf.browser.fromPixels(contentImgRef.value).toFloat().div(tf.scalar(255)).expandDims())
    })
    const styleBottleneck = bottleneck
    bottleneck = tf.tidy(() => {
      const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio.value))
      const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0 - styleRatio.value))
      return styleBottleneckScaled.addStrict(identityBottleneckScaled)
    })
    styleBottleneck.dispose()
    identityBottleneck.dispose()
  }

  // this.styleButton.textContent = 'Stylizing image...';
  // await tf.nextFrame();
  const stylized = tf.tidy(() => {
    return transformModel.value.predict([tf.browser.fromPixels(contentImgRef.value).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze()
  })
  tf.browser.toPixels(stylized, stylizedRef.value)
  bottleneck.dispose()  // Might wanna keep this around
  stylized.dispose()
  ElMessage.success({message:'风格迁移完成', duration:1.5})
}

</script>

<style scoped lang='scss'>
.contentImg, .styleImg {
  max-width: 400px;
  max-height: 400px;
  margin: auto;
  display: block;
}

.select {
  width: 500px !important;
  margin: 10px;
}

.canvas {
  margin-top: 10px;
}
</style>