<template>
  <el-dialog
      title="预览"
      :v-model="visible"
      :destroyOnClose="true"
      :width="`${width}px`"
  >
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
import {onMounted, ref, computed} from "vue";

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
const visible = ref(false)
const {formDesign} = props
const formBuildRef = ref()
const formDesignData = ref()
const previewWidth = ref(850)
const width = computed(()=>{
  return previewWidth.value ? previewWidth.value : 850
})

const setData =(e) => {
  formDesignData.value = e
}

const handleSubmit =() => {
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