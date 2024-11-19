<template>
  <ElDialog
      v-model="dialogVisible"
      title="新增"
      width="40%"
      draggable
      destroy-on-close
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :label-position="labelPosition"
    >
      <el-row :gutter="20">
          <el-form-item label="uuid" prop="uuid" class="hiddenItem">
            <el-input v-model="formData.uuid"></el-input>
          </el-form-item>
        <el-col :md="12">
          <el-form-item label="登录名" prop="userNameId">
            <el-input v-model="formData.userNameId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" v-if="!formData.uuid">
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="formData.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="绑定ip" prop="address">
            <el-input v-model="formData.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="头像" prop="telphone">
            <el-input v-model="formData.telphone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="服务到期日期" prop="date">
            <el-input v-model="formData.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="所属机构" prop="orgId">
            <el-tree-select
                v-model="formData.orgId"
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
        <el-col :md="12">
          <el-form-item label="角色" prop="userGroup">
            <el-select v-model="formData.userGroup" placeholder="角色">
              <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button @click="submitForm(formRef)">确定</el-button>
    </template>

  </ElDialog>

</template>

<script setup lang="ts">
import {ref, toRefs, reactive, watch} from 'vue'
import {useBoolean} from "@/hooks/useBoolean";
import type {FormInstance} from "element-plus"
import request from "@/utils//axios";
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
  }
})
const emit = defineEmits(["update:visible", "close"])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const formData = ref(props.data)
const rules = {
  userNameId: [{required: true, message: '必填', trigger: 'blur'},],
  userName: [{required: true, message: '必填', trigger: 'blur'},],
  orgId: [{required: true, message: '必填', trigger: 'blur'},],
  userGroup: [{required: true, message: '必填', trigger: 'blur'},],
}
const labelPosition = ref('right')

const defaultExpandedKeys = ref()
const options = ref([])

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
      const data = val.uuid ? val : null
      formData.value = val

      let list = []
      if(val.idss){
        list = val.idss.split(',')
        defaultExpandedKeys.value= list.map(Number)
      }

      if(val.orgId){
        request.post({url: '/system/authGroup/getListByUserUuid', data: {organzitionId: val.orgId}}).then(res => {
          options.value = res.data.rows
        })
      }
    },
    {deep: true}
)

const closeDialog = () => {
  formData.value.uuid = ''
  formData.value.password = ''
  dialogVisible.value = false
  // formData.value = JSON.parse(JSON.stringify({}))
  resetForm(formRef.value)
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
}


const load = (node, resolve) => {
  if (node.isLeaf) return resolve([])
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
  request.post({url: '/system/authGroup/getListByUserUuid', data: {organzitionId: data.id}}).then(res => {
    options.value = res.data.rows
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let url = formData.value.uuid ? '/system/user/update' : '/system/user/save'
      if(formData.value.uuid){
        delete formData.value.password
      }
      request.post<any>({url: url, data: formData.value}).then(res => {
        if (res.statusCode === 200) {
          dialogVisible.value = false
          resetForm(formRef.value)
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