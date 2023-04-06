<template>
  <el-select v-model="value" :style="{width: props.size ? `${props.size}px`: '100%'}">
    <el-option
        v-for="(item, key) in options"
        :key="key"
        :label="labelField ? item[labelField] : item.label ||item.text"
        :value="valueField ? item[valueField] : item.value"
    >
    <span>{{labelField ? item[labelField] : item.label ||item.text }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import request from '@/utils/axios'

const props = defineProps({
  /** 字典代码*/
  dictCode: {
    type: String,
  },
  /** 数据类型：code、static、dynamic，默认：code*/
  dataType: {
    type: String,
    default: 'code'
  },
  /** 宽*/
  size: String,
  /** label字段*/
  labelField: String,
  /** value字段*/
  valueField: String

})
const value = ref('')
const options = ref([])

const initDictData = () =>{
  request.post({url:'/system/dicSet/getDicItemByCode', data:{code: props.dictCode}}).then(res => {
    options.value = res.data
  })
}

watch(
    () => props.dataType,
    val => {
      if(val === 'code'){
        initDictData()
      }
    },
    {immediate:true}
)

</script>

<style scoped>

</style>