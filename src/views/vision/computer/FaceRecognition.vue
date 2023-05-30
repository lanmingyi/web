<template>
  <div>
    <div>
      <!--选择模型-->
      <el-select style="width: 150px; margin-right: 10px" @change="changeWebModel" placeholder="请选择模型">
        <el-option v-for="(item,key) in webModelList" :key="key" :value="item">{{ item }}</el-option>
      </el-select>
      <!-- 开始识别-->
      <el-button v-if="!isRecognition" type="primary" @click="startRecognition">开始识别</el-button>
      <el-button v-else type="danger" @click="finishRecognition">停止识别</el-button>
    </div>
    <br/>
    <div class="video-canvas">
      <video ref="videoRef" autoplay @loadedmetadata="setCanvas"></video>
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, nextTick} from 'vue'
import * as faceapi from 'face-api.js';

const nets = ref("tinyFaceDetector")
const isRecognition = ref(false)
const webModelList = ['ssd_mobilenetv1', 'tiny_face_detector']
const minConfidence = ref(0.5)
const inputSize = ref(512)
const scoreThreshold = ref(0.5)
const faceMatcher = ref()
const faceImg = [{name: "lmy", img: ["/images/lmy/lmy.png",],},]
const timer = ref()
const videoRef = ref()
const canvasRef = ref()
const options = ''

watch(() => nets.value, (val) => {
  nets.value = val;
  changeWebModel();
})

const changeWebModel = async () => {
  await faceapi.nets[nets.value].loadFromUri("/models/faceapi");
  await faceapi.loadFaceLandmarkModel("/models/faceapi");
  // let minConfidence = this.minConfidence
  // let inputSize = this.inputSize
  // let scoreThreshold = this.scoreThreshold
  //
  // this.options =  e === 'ssd_mobilenetv1'
  //     ? new faceapi.SsdMobilenetv1Options({ minConfidence })
  //     : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  // console.log('this.options', this.options)
}
const startRecognition = async () => {
  isRecognition.value = true
  // navigator.getUserMedia()
  navigator.mediaDevices
      .getUserMedia(
          {
            video: true,
          })
      .then((stream) => {
        videoRef.value.srcObject = stream
        videoRef.value.play()
      })
      .catch(err => {
        console.log(err)
        isRecognition.value = false
      })

  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models/faceapi");
  await faceapi.loadFaceLandmarkModel("/models/faceapi");
  await faceapi.loadFaceRecognitionModel("/models/faceapi");

  // 人脸识别
  faceMatcher.value = await createFaceMatcher()

  // await faceapi.loadMtcnnModel('/models')
  // console.log(await faceapi.loadMtcnnModel('/models'))
  //
  // await faceapi.loadFaceRecognitionModel('/models')
  // const mtcnnForwardParams = {
  //   // limiting the search space to larger faces for webcam detection
  //   minFaceSize: 200
  // }
  // const mtcnnResults = await faceapi.mtcnn(this.$refs.video, mtcnnForwardParams)
  // console.log('mtcnnResults', mtcnnResults)
  //
  // faceapi.drawDetection('canvas', mtcnnResults.map(res => res.faceDetection), { withScore: false })
  // faceapi.drawLandmarks('canvas', mtcnnResults.map(res => res.faceLandmarks), { lineWidth: 4, color: 'red' })
  //
  // // const detections = faceapi.detectAllFaces(this.$refs.video)
  // // console.log('detections', detections)
}


const createFaceMatcher = async () => {
  const labeledFaceDescriptors = await Promise.all(
      faceImg.map(async faceImg => {
        const descriptors: any[] = []
        for (let image of faceImg.img) {
          const img = await faceapi.fetchImage(image)
          descriptors.push(await faceapi.computeFaceDescriptor(img))
        }
        return new faceapi.LabeledFaceDescriptors(faceImg.name, descriptors)
      })
  )
  return new faceapi.FaceMatcher(labeledFaceDescriptors)
}

const finishRecognition = () => {
  isRecognition.value = false
  if (!videoRef.value.srcObject) return;
  let stream = videoRef.value.srcObject;
  let tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
  videoRef.value.srcObject = null;
}

const  setCanvas = async () => {
  // let ctx = this.$refs["canvas"].getContext("2d");
  // ctx.drawImage(this.$refs["video"], 0, 0, 500, 376);
  const result = await faceapi
      .detectAllFaces(videoRef.value, options)
      .withFaceLandmarks()
      .withFaceDescriptors()

  // console.log('result', result)
  const dims = faceapi.matchDimensions(canvasRef.value, videoRef, true);
  // console.log(dims)
  const resizedResults = faceapi.resizeResults(result, dims);
  // 人脸检测
  // faceapi.draw.drawDetections(this.$refs["canvas"], resizedResults);
  // console.log(resizedResults)
  // 人脸识别
  resizedResults.forEach(({detection, descriptor}) => {
    const label = faceMatcher.value.findBestMatch(descriptor).toString();
    new faceapi.draw.DrawBox(detection.box, {label}).draw(canvasRef.value);
  });

  // let imgBase64 = this.$refs["canvas"].toDataURL("image/jpeg", 0.7);
  // let str = imgBase64.replace("data:image/jpeg;base64,", "");
  // this.base64 = str;
  // const { data: res } = await this.$http.post("/img", this.base64);
  // this.acc = res.acc;
}

onMounted(() => {
  timer.value = setInterval(() => {
    if (isRecognition.value) {
      setCanvas();
    }
  }, 0);

  nextTick(() => {
    changeWebModel()
  });
})
</script>

<style scoped>
.video-canvas {
  position: relative;
  margin-top: 30px;
  margin-left: 400px;
}

.video-canvas canvas {
  position: absolute;
  top: 0;
  left: 0;
}

</style>