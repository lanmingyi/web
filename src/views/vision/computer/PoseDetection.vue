<template>
  <div>
    <div>
      <el-button v-if='!isBackEndDetection' type='primary' @click='backEndDetection' style='margin-right: 10px;'>
        后端检测
      </el-button>
      <el-button v-else type='danger' @click='stopBackEndDetection' style='margin-right: 10px;'>停止检测</el-button>
    </div>
    <div>
      <div class='canvas-content'>
        <img v-if='isBackEndDetection' ref='img' :src='detectionImg' width='1360' height='720'/>
        <video ref='webcamVideo' width='640' height='480'></video>
        <canvas ref='canvas' width='640' height='480'/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue'

const isBackEndDetection = ref(false)
const detectionImg = ref('')
const serverUrl = 'http://127.0.0.1:50000'

const backEndDetection = () => {
  isBackEndDetection.value = true
  detectionImg.value = serverUrl + '/openpose'
}
const stopBackEndDetection = () => {
  isBackEndDetection.value = false
  detectionImg.value = ''
}

</script>

<style scoped lang="scss">
.canvas-content {
  position: relative;
  margin-top: 30px;
  margin-left: 100px;
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
</style>