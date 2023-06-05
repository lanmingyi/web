<template>
  <div>
    <div v-loading="spinning">
      <el-select id='content-select' style='width: 150px; margin-right: 10px;' @select='changeImage'
                 placeholder='请选择检测对象'>
        <el-option v-for='(item,key) in imageList' :key='key' :value='item'>
          {{ item }}
        </el-option>
      </el-select>
      <input type='file' ref='fileSelect' style='display: none' accept='image/x-png,image/gif,image/jpeg'/>
      <el-select style='width: 150px; margin-right: 10px;' @change='changeWebModel' placeholder='请选择模型'>
        <el-option v-for='(item,key) in webModelList' :key='key' :value='item'>{{ item }}</el-option>
      </el-select>
      <el-button v-if='!isDetection' type='primary' @click='openWebcam' style='margin-right: 10px;'>打开摄像头
      </el-button>
      <el-button v-else type='danger' @click='closeWebcam' style='margin-right: 10px;'>关闭摄像头</el-button>
      <el-button type='primary' @click='startDetection' :disabled='disabled' style='margin-right: 10px;'>开始检测
      </el-button>
      <el-button v-if='!isBackEndDetection' type='primary' @click='backEndDetection' style='margin-right: 10px;'>
        后端检测
      </el-button>
      <el-button v-else type='danger' @click='stopBackEndDetection' style='margin-right: 10px;'>停止检测</el-button>
    </div>
    <div>
      <div class='canvas-content'>
        <img ref='imgRef' :src='detectionImg' width='640' height='480'/>
        <video ref='webcamVideo' width='640' height='480'></video>
        <canvas ref='canvasRef' width='640' height='480'/>
      </div>
    </div>
    <div>
      <!--        <canvas ref='hiddenCanvasRef' style='display: none' />-->
      <!--        <el-button type='primary' @click='takePicture' style='margin-right: 5px'>拍摄</el-button>-->
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue'
import * as tf from '@tensorflow/tfjs'
import axios from 'axios'
import {ElMessage} from "element-plus";
// const weights = '/web_model/model.json';
const names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
  'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
  'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
  'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
  'hair drier', 'toothbrush']

const imageList = ['选择文件', 'street.jpg', 'dog.jpg', 'eagle.jpg', 'giraffe.jpg', 'horses.jpg', 'person.jpg']
const webModelList = ['yolov5s', 'yolov5x']
const detectionImg = ref(new URL('@/assets/images/object_detection/street.jpg', import.meta.url).href)

const detectionFrame = ref()
const model = ref()
const spinning = ref(false)
const disabled = ref(true)
const isDetection = ref(false)
const isBackEndDetection = ref(false)
const file = ref()
const server_url = 'http://127.0.0.1:50000'
const fileSelectRef = ref()
const canvasRef = ref()
const webcamVideoRef = ref()
const imgRef = ref()
const hiddenCanvasRef = ref()

const clearCanvas = () => {
  canvasRef.value.getContext('2d').clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}
const changeImage = (e, option) => {
  clearCanvas()
  if (e === '选择文件') {
    fileSelectRef.value.onchange = (evt) => {
      file.value = evt.target.files[0]
      // console.log('选择文件', evt.target.files[0])
      const fileReader = new FileReader()
      fileReader.onload = ((e) => {
        detectionImg.value = e.target!.result
      })
      fileReader.readAsDataURL(file.value)
      fileSelectRef.value.value = ''
    }
    fileSelectRef.value.click()
  } else {
    detectionImg.value = new URL(`@/assets/images/object_detection/${e}`, import.meta.url).href
  }
}

const changeWebModel = async (e) => {
  spinning.value = true
  await tf.loadGraphModel(`/models/yolo/${e}_web_model/model.json`).then(model => {
    model.value = model
    spinning.value = false
    ElMessage.success({message: '模型加载成功', duration: 1500})
    disabled.value = false
  })
}

const openWebcam = () => {
  clearCanvas()
  // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {}
  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
  // console.log('navigator.getUserMedia', navigator.getUserMedia)

  navigator.getUserMedia(
      {
        video: true
      },
      (stream) => {
        // this.stream = stream
        webcamVideoRef.value.srcObject = stream
        webcamVideoRef.value.webcamVideo.play()
      },
      (err) => {
        console.error(err)
      }
  )
  isDetection.value = true
}

const closeWebcam = () => {
  webcamVideoRef.value.srcObject.getTracks()[0].stop()
  webcamVideoRef.value.srcObject = null
  isDetection.value = false
  clearCanvas()
}

const startDetection = (e) => {
  if (isDetection.value) {
    detectionFrame.value = webcamVideoRef.value
  } else {
    detectionFrame.value = imgRef.value
  }
  const threshold = 0.25
  let [modelWidth, modelHeight] = model.value.inputs[0].shape.slice(1, 3)
  // console.log('tf.browser.fromPixels(c)', tf.browser.fromPixels(c))
  const input = tf.tidy(() => {
    return tf.image.resizeBilinear(tf.browser.fromPixels(detectionFrame.value), [modelWidth, modelHeight])
        .div(255.0).expandDims(0)
  })
  model.value.executeAsync(input).then(res => {
    const [boxes, scores, classes, valid_detections] = res
    const boxes_data = boxes.dataSync()
    const scores_data = scores.dataSync()
    const classes_data = classes.dataSync()
    const valid_detections_data = valid_detections.dataSync()[0]
    renderBoxes(canvasRef.value, threshold, boxes_data, scores_data, classes_data)
    tf.dispose(res)
  })
}

const renderBoxes = (canvasRef, threshold, boxes_data, scores_data, classes_data) => {
  const ctx = canvasRef.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) // clean canvas

  // font configs
  const font = '14px sans-serif'
  ctx.font = font
  ctx.textBaseline = 'top'

  for (let i = 0; i < scores_data.length; ++i) {
    if (scores_data[i] > threshold) {
      const klass = names[classes_data[i]]
      const score = (scores_data[i] * 100).toFixed(1)

      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
      x1 *= canvasRef.width
      x2 *= canvasRef.width
      y1 *= canvasRef.height
      y2 *= canvasRef.height
      const width = x2 - x1
      const height = y2 - y1

      // Draw the bounding box.
      ctx.strokeStyle = 'rgba(0, 0, 255, 1)'
      ctx.lineWidth = 2
      ctx.strokeRect(x1, y1, width, height)

      // Draw the label background.
      ctx.fillStyle = 'rgba(0, 0, 255, 1)'
      const textWidth = ctx.measureText(klass + ' - ' + score + '%').width
      const textHeight = parseInt(font, 10) // base 10
      ctx.fillRect(x1 - 1, y1 - (textHeight + 2), textWidth + 2, textHeight + 2)

      // Draw labels
      // ctx.fillStyle = '#000000'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(klass + ' - ' + score + '%', x1 - 1, y1 - (textHeight + 2))
    }
  }
}

const backEndDetection = () =>  {
  isBackEndDetection.value= true
  detectionImg.value = server_url + '/video_feed'
  // // this.img = this.$refs.img
  // // this.file = this.img.src
  // let param = new FormData()
  // param.append('file', this.file)
  // // console.log('param', param)
  // // var timer = setInterval(() => {
  // //   this.myFunc();
  // // }, 30);
  // let config = {
  //   headers: { 'Content-Type': 'multipart/form-data' }
  // } //添加请求头
  // axios
  //   .post(this.server_url + '/video_feed')
  //   .then((response) => {
  //     this.$refs.detectionImg = response.data.draw_url
  //     // ctx.drawImage(
  //     //     response.data.draw_url,
  //     //     0,
  //     //     0
  //     // );
  //   })
}
const stopBackEndDetection = () => {
  isBackEndDetection.value = false
  detectionImg.value = new URL('@/assets/images/object_detection/street.jpg', import.meta.url).href
}

const takePicture = () => {
  const hiddenCanvas = hiddenCanvasRef.value
  const hiddenContext = hiddenCanvas.getContext('2d')
  hiddenCanvas.width = webcamVideoRef.value.width
  hiddenCanvas.height = webcamVideoRef.value.height
  // console.log('hiddenCanvas.width', hiddenCanvas.width)
  // console.log('hiddenCanvas.height', hiddenCanvas.height)
  hiddenContext.drawImage(webcamVideoRef.value, 0, 0,
      hiddenCanvas.width, hiddenCanvas.height)
  const imageDataURL = hiddenCanvas.toDataURL('image/jpg')
  detectionImg.value = imageDataURL
}
</script>

<style scoped lang="scss">
.canvas-content {
  position: relative;
  margin-top: 30px;
  margin-left: 400px;
}

.canvas-content canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.canvas-content video {
  position: absolute;
  top: 0;
  left: 0;
}

.detect-img {
  max-width: 640px;
  max-height: 640px;
}
</style>