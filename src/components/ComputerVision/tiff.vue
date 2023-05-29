<template>
  <img :id="id" :src="src" alt="" :style="size" v-if="src" />
</template>

<script>
import { getFileAccessHttpUrl } from '@api/manage'
const axios = require('axios')
var Tiff = require('tiff.js');
Tiff.initialize({ TOTAL_MEMORY: 19777216 * 10 })
export default {
  name: 'Tiff',
  props: {
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
                height: 'auto'
            }
        }
    },
    id: {
        type: String
    }
  },
  watch: {
    path: {
      immediate: true,
      handler: function (val) {
        if(this.types==='image/tiff'){
          axios
          .get(getFileAccessHttpUrl(val), {
            responseType: 'arraybuffer',
          })
          .then((res) => {
            // Tiff.initialize({ TOTAL_MEMORY :500000 })
            var tiff = new Tiff({ buffer: res.data })
            this.src = tiff.toDataURL()
            this.$emit('onChangeUrl', this.src)
            //document.querySelector(`#img${id}`).src = tiff.toDataURL()
          })
        }else{
          this.src = getFileAccessHttpUrl(val)
          this.$emit('onChangeUrl', this.src)
        }        
      },
    },
  },
  data() {
    return {
      src: '',
    }
  },
  created() {
  },
  methods: {
  },
  computed: {
  },
}
</script>

<style scoped></style>
