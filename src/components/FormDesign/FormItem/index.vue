<template>
  <div>
    <el-form-item
        v-if="['input','textarea','date','time','number','radio','checkbox','select','rate','switch','slider','uploadImg','uploadFile','cascader','treeSelect',].includes(formItem.type)"
        :label="formItem.label"
        prop="rules"
    >
      <el-input
          v-if="formItem.type === 'input'"
          v-model="formItem.model"
          :disabled="formItem.options.disabled"
          :placeholder="formItem.options.placeholder"
          :allowClear="formItem.options.clearable"
          :maxLength="formItem.options.maxLength"
          :addonBefore="formItem.options.prefix"
          :addonAfter="formItem.options.suffix"
          @change="handleChange($event.target.value, formItem.model)"
      ></el-input>
    </el-form-item>
  </div>

</template>

<script setup lang="ts">
import {computed} from "vue";

defineOptions({
  name: 'FormItem'
})

const props = defineProps({
  // 表单数组
  formItem: {
    type: Object,
    required: true
  },
  // 数据表名
  tableName: {
    type: String
  },
})
const emit = defineEmits(['change', ''])
const {formItem} = props

const rules = computed(() => {

})
const handleChange = (value, key) => {
  formItem.options.defaultValue = value
  emit('change', value, key)
}


</script>

<style scoped>

</style>