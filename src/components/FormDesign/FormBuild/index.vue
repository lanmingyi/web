<!--组件构建-->
<template>
  <el-config-provider :local="local">
    <el-form ref="formRef">
      <build-blocks
          ref="buildBlocksRef"
          v-for="(formItem, index) in value.list"
          :form-item="formItem"
          :key="index"
          :table-name="tableName"
          :isMultiForm="isMultiForm"
          :config="config"
          :form-config="value.config"
          :dynamic-data="dynamicData"
          :disabled="disabled"
          :form-uuid="formUuid"
          @handleReset="reset(formRef)"
          @change="handleChange"
          v-bind="$attrs"
      >
      </build-blocks>
    </el-form>
  </el-config-provider>
</template>

<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'
import type {FormInstance} from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import BuildBlocks from "@/components/FormDesign/FormBuild/BuildBlocks.vue";

const props = defineProps({
  value: {
    type: [Object, String],
    required: true
  },
  tableName: {
    type: String,
  },
  isMultiForm: {
    type: String,
  },
  dynamicData: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  outputString: {
    type: Boolean,
    default: false,
  },
  defaultValue: {
    type: Object,
    default: () => ({}),
  },
  formUuid: {
    type: String,
  },
})
const emit = defineEmits(['change'])

const {defaultValue} = props
const formRef = ref<FormInstance>()
const buildBlocksRef = ref()
const local = zhCn

const reset = (formEl: FormInstance | undefined) =>{
  formEl && formEl.resetFields()
}

const handleChange = (value, key) =>{
  emit('change', value, key)
}

const getData = () => {
  return new Promise((resolve,reject)=>{
    try {
      formRef.value && formRef.value.validate(valid => {

      })
    }catch (err){
      reject(err)
    }
  })
}
const setData = (json) => {

}

onMounted(() => {
  nextTick(()=>{
    setData(defaultValue)
  })
})


</script>

<style scoped>

</style>