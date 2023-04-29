<template>
  <el-dialog>
    <form-build
        ref="formBuildRef"
        :value="formDesignData"
        :disabled="isView"
        :form-uuid="formUuid"
        :isMultiForm="isMultiForm"
        @submit="handleSubmit"
        v-bind="$attrs"
    ></form-build>
  </el-dialog>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const props = defineProps({
  formDesign:{
    type: Object
  },
  formUuid:{
    type: String
  },
  isView: {
    type: String
  },
  isMultiForm:{
    type: String
  },
  tableName: {
    type: String
  }
})
const emit = defineEmits(['getJsonData'])

const {formDesign} = props
const formBuildRef = ref()
const formDesignData = ref()

const setData =(e) => {
  formDesignData.value = e
}

const getJsonData = () => {
  formBuildRef.value.getData().then(res => {
    emit('getJsonData', res, formDesignData)
  }).catch(err=>{
    console.log('获取数据失败', err)
  })
}


onMounted(()=> {
  formDesignData.value = formDesign
})
</script>

<style scoped>

</style>