<template>
  <img :id="id" :src="src" alt="" :style="size" v-if="src" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'Tiff'
})
import {ref, watch} from "vue";
import {SERVER_URL} from "@/utils/axios/service";
const axios = require('axios')
let Tiff = require('tiff.js');
Tiff.initialize({ TOTAL_MEMORY: 19777216 * 10 })

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
  types: {
    type: String,
    default: '',
  },
  size: {
    type: Object,
    default: () => {
      return {
        width: '150px',
        height: 'auto',

        // // width: 'auto',
        // height: 'auto',
        // 'width': '360px',
        // // 'height': '320px',
        // 'margin-top': '10px',
        // 'margin-bottom': '30px',
        // 'margin-left': '10px'
      }
    }
  },
  id: {
    type: String
  }
})

const emit = defineEmits(['onChangeUrl'])
const src = ref()

watch(
    ()=> props.path,
    val=>{
      if(props.types==='image/tiff'){
        axios.get(SERVER_URL+"/sys/common/static"+'/'+ val,
            {responseType: 'arraybuffer',}).then((res) => {
              // Tiff.initialize({ TOTAL_MEMORY :500000 })
              let tiff = new Tiff({ buffer: res.data })
              src.value = tiff.toDataURL()
              emit('onChangeUrl', src.value)
              //document.querySelector(`#img${id}`).src = tiff.toDataURL()
            })
      }else{
        src.value = SERVER_URL+"/sys/common/static"+'/'+ val
        emit('onChangeUrl', src.value)
      }
    },
    {immediate: true}
)
</script>

<style scoped>
</style>
