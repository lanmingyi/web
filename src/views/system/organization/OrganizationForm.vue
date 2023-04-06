<template>
  <ElDialog
      v-model="dialogVisible"
      title="新增"
      width="769px"
      draggable
      destroy-on-close
      :close-on-click-modal="false"
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
    >
      <el-row :gutter="35">
<!--        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">-->
          <el-form-item label="uuid" prop="uuid" class="hiddenItem">
            <el-input v-model="formData.uuid"></el-input>
          </el-form-item>
<!--        </el-col>-->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="机构名称" prop="text">
            <el-input v-model="formData.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="自定义机构编码" prop="customerCode">
            <el-input v-model="formData.customerCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系人" prop="leader">
            <el-input v-model="formData.leader"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="地址" prop="address">
            <el-input v-model="formData.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="电话" prop="telphone">
            <el-input v-model="formData.telphone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if="formData.addType==='children' || formData.uuid &&formData.levelId !==1">
          <el-form-item  label="上级机构" prop="pid">
            <el-tree-select
                v-model="formData.pid"
                lazy
                :load="load"
                node-key="id"
                check-strictly
                :render-after-expand="false"
                :props="{label: 'text'}"
                @node-click="handleClick"
                :default-expanded-keys="defaultExpandedKeys"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="门户头部logo" prop="headImg">
            <el-input v-model="formData.headImg"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="门户首页图片" prop="homeImg">
            <el-input v-model="formData.homeImg"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog(formRef)">取消</el-button>
      <el-button @click="submitForm(formRef)">确定</el-button>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {ref, toRefs, reactive, watch, computed, nextTick} from 'vue'
import {useBoolean} from "@/hooks/useBoolean";
import type {FormInstance} from "element-plus"
import request from "@/axios";
import {ElMessage} from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
})
const emit = defineEmits(["update:visible", "close"])

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const formData = ref(props.data)
const rules = {
  text: [{required: true, message: '必填', trigger: 'blur'},],
  customerCode: [{required: true, message: '必填', trigger: 'blur'},],
  leader: [{required: true, message: '必填', trigger: 'blur'},],
  address: [{required: true, message: '必填', trigger: 'blur'},],
  telphone: [{required: true, message: '必填', trigger: 'blur'},],
  pid: [{required: true, message: '必填', trigger: 'blur'},],
}
let title = ''
const defaultExpandedKeys = ref()

watch(
    () => dialogVisible.value,
    val => emit("update:visible", val)
)
watch(
    () => props.visible,
    val => {
      dialogVisible.value = val
    }
)
watch(
    () => props.data,
    val => {
      formData.value = val
      formData.value.oldOrgId = formData.value.pid

      let list = []
      if (val.ids) {
        list = val.ids.split(',')
        defaultExpandedKeys.value = list.map(Number)
      }
      // title = formData.value.uuid ? '编辑' : '新增'
    },
)


// 加载树形
const load = (node, resolve) => {
  if (node.isLeaf) return resolve([])
  // if (node.id === 0) {
  if (node.data.length === 0) {
    request.post<any>({url: '/system/organization/getListByLevelId', data: {levelId: 1}}).then(res => {
      resolve(res.data)
    })
  } else {
    request.post<any>({url: '/system/organization/getListByPid', data: {pid: node.data.id}}).then(res => {
      resolve(res.data)
    })

  }
}

const handleClick = (data) => {
  // console.log('data', data)
  // console.log('data.id', data.id)
  // // formData.value.pid = data.id
  // console.log('formData', formData)
}


const closeDialog = (formRef) => {
  // resetForm(formRef.value)
  resetForm(formRef)
  formData.value.pid = ""
  formData.value.oldOrgId = ""
  formData.value.uuid = ""
  dialogVisible.value = false

}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let url = formData.value.uuid
          ? '/system/organization/update'
          : formData.value.addType === 'root' ? '/system/organization/saveRoot' : '/system/organization/save'
      request.post<any>({url: url, data: formData.value}).then(res => {
        if (res.statusCode === 200) {
          dialogVisible.value = false
          resetForm(formRef.value)
          ElMessage.success('保存成功')
          emit('close')
        } else {
          ElMessage.error('保存失败')
        }
      })
    } else {
      console.log('error', fields)
    }
  })

}
</script>

<style lang="scss" scoped>
.class {

}

</style>