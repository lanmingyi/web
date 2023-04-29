<template>
  <el-card>
    <template #header>
      <el-checkbox v-model="allView" label="可查看" size="large"
                   @change="(e) => changeViewEditAll(e.target.checked, 0)"/>
      <el-checkbox v-model="allEdit" :disabled="!allDisabled" label="可编辑" size="large"
                   @change="(e) => changeViewEditAll(e.target.checked, 1)"/>
    </template>
    <el-table :data="formFieldList">
      <el-table-column v-for="(item, index) in formFieldList" :prop="item.filedName" :key="index"></el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-checkbox label="可查看" @change="changeViewEdit(scope, 0)"/>
          <el-checkbox label="可编辑" @change="changeViewEdit(scope, 1)"/>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import {ref, toRefs} from 'vue'

defineOptions({
  name: 'FormPanel'
})

const props = defineProps({
  modeler: {
    type: Object,
    required: true
  },
  nodeElement: {
    type: Object,
    required: true
  },
  formFieldLists: {
    type: Array,
  },
  updateList: {
    type: Array,
  },
})
const {modeler, nodeElement} = toRefs(props)

const allView = ref(false)
const allEdit = ref(false)
const allDisabled = ref(false)
const formFieldList = ref<any[]>([])

const getStatus = (list) => {
  const flagView = list.some(item => {
    return item.isView === false
  })
  const flagEdit = list.some(item => {
    return item.isEdit === false
  })
  if (flagView) {
    allView.value = false
    allDisabled.value = false
  } else {
    allView.value = true
  }

  // if (flagEdit) {
  //   allEdit.value = false
  // } else {
  //   allEdit.value = true
  // }
  allEdit.value = !flagEdit;
}

// 全选
const changeViewEditAll = (data, type) => {
  formFieldList.value.forEach(e => {
    if (data && type === 0) e.isView = true;
    getStatus(formFieldList.value)
    e.isEdit = data && type === 1;

    if (!data && type === 0) e.isView = false;
    e.isEdit = false;
    getStatus(formFieldList.value)
    e.isEdit = !data && type === 1;
  })
  updateProperties({formFieldList: JSON.stringify(formFieldList.value)})
}

// 编辑查看设置
const changeViewEdit = (data, type) => {
  if(type == 1 && data.isEdit){
    data.isView= true
  }
  updateProperties({formFieldList: JSON.stringify(formFieldList.value)})
  getStatus(formFieldList.value)
}

// 更新流程属性
const updateProperties = (properties) => {
  modeler.value.get("modeling").updateProperties(nodeElement.value, properties)
}

</script>

<style scoped>

</style>