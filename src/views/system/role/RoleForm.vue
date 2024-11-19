<template>
  <ElDialog
      v-model="dialogVisible"
      title="角色"
      width="769px"
      draggable
      destroy-on-close
      :close-on-click-modal="false"
  >
    <template #default>
      <el-form
          ref="formRef"
          :model="formData"
          label-width="100px"
          :rules="rules"
      >
        <el-row>
          <el-form-item class="hiddenItem">
            <el-input v-model="formData.id"></el-input>
          </el-form-item>
          <el-col :md="8">
            <el-form-item label="角色名称" prop="text">
              <el-input v-model="formData.roleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="8">
            <el-form-item label="角色编码" prop="text">
              <el-input v-model="formData.roleCode"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :md="8">-->
          <!--            <el-form-item label="请选择机构" prop="organzitionId">-->
          <!--              <el-tree-select-->
          <!--                  v-model="formData.organzitionId"-->
          <!--                  lazy-->
          <!--                  :load="load"-->
          <!--                  node-key="id"-->
          <!--                  check-strictly-->
          <!--                  :render-after-expand="false"-->
          <!--                  :props="{label: 'text'}"-->
          <!--                  @node-click="handleClick"-->
          <!--                  :default-expanded-keys="defaultExpandedKeys"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :md="8">-->
          <!--            <el-form-item label="引用角色" prop="usePid">-->
          <!--              <el-select v-model="formData.usePid" placeholder="引用角色" @change="changeRole">-->
          <!--                <el-option-->
          <!--                    v-for="item in options"-->
          <!--                    :key="item.id"-->
          <!--                    :label="item.text"-->
          <!--                    :value="item.id"-->
          <!--                />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <el-row>
          <el-form-item label="分配资源">
            <el-dropdown>
              <el-button>操作
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>选择全部</el-dropdown-item>
                  <el-dropdown-item>取消选择</el-dropdown-item>
                  <el-dropdown-item>展开全部</el-dropdown-item>
                  <el-dropdown-item>折叠全部</el-dropdown-item>
                  <el-dropdown-item>层级关联</el-dropdown-item>
                  <el-dropdown-item>层级独立</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="roleList">
            <el-tree
                ref="treeRef"
                :data="formData.roleList"
                node-key="key"
                show-checkbox
                check-strictly
                :default-checked-keys="formData.checkedKeys"
                :props="{label: 'slotTitle'}"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick(formRef)">取消</el-button>
        <el-button type="primary" @click="confirmClick(formRef)">确认</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {ref, watch, nextTick} from "vue";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
import request from "@/utils/axios";
import {ElTree} from "element-plus";
import {pick} from "lodash";
// import Dialog from '@/components/Dialog/index.vue'


const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  url: {
    type: Object
  }
})
const emit = defineEmits(['update:visible', 'close'])
const dialogVisible = ref(false)
const formData = ref({...props.data})
const formRef = ref<FormInstance>()
const rules = {
  text: [{required: true, message: '必填', trigger: 'blur'},],
  organzitionId: [{required: true, message: '必填', trigger: 'blur'},],
  // roleList: [{ required: true, message: '必填', trigger: 'blur' },],
}

const defaultExpandedKeys = ref()
const options = ref([])

interface demoTree {
  id: string;
  label: string;
  children?: demoTree[];
}

const demoData: demoTree[] = []

watch(
    () => dialogVisible.value,
    val => {
      emit('update:visible', val)
      if (val) {
      }
    }
)
watch(
    () => props.visible,
    val => dialogVisible.value = val
)
watch(
    () => props.data,
    val => {
      console.log('val', val)
      formData.value = val
      let list = []
      if (val.ids) {
        list = val.ids.split(',')
        defaultExpandedKeys.value = list.map(Number)
      }
      if (val.organzitionId) {
        request.post({
          url: '/system/authGroup/getListByUserUuid',
          data: {organzitionId: val.organzitionId}
        }).then(res => {
          options.value = res.data.rows
          // nextTick()
        })
      }
    },
    {deep: true}
)


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

const changeRole = (data) => {
  // resetChecked()
  let keys: any[] = []
  request.post<any>({
    url: '/system/authGroup/getGrantDetailByUuid',
    data: {uuid: formData.value.uuid, roleId: data, roleType: formData.value.roleType}
  }).then(res => {
    res.data.list.forEach(e => {
      if (e.accessAuth === 1 && e.pid !== 1) {
        keys.push(e.id)
      }
    })
    treeRef.value?.setCheckedKeys(keys, false)
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}

const cancelClick = (formRef) => {
  formData.value.uuid = ''
  formData.value.checkedKeys = []
  resetChecked()
  resetForm(formRef)
  dialogVisible.value = false

}

const treeRef = ref<InstanceType<typeof ElTree>>()
const confirmClick = async (formEl: FormInstance | undefined) => {
  // console.log(treeRef.value!.getCheckedNodes(false, false))
  // console.log(treeRef.value!.getCheckedKeys(false))
  // formData.value.attributes = treeRef.value!.getCheckedKeys(false).toString()

  let datas = {
    roleId: formData.value.id,
    permissionIds: treeRef.value!.getCheckedKeys(false).toString(),
    lastpermissionIds: formData.value.checkedKeys
  }

  request.post<any>({url: "/sys/permission/saveRolePermission", data: datas}).then(res => {
    ElMessage.success(res.message)
    dialogVisible.value = false
    emit('close')
  })
  const fileds = ['id', 'roleName', 'roleCode']

  if (!formEl) return
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
  //     let url = formData.value.id ? "/sys/role/edit" : "/sys/role/add"
  //     request.post<any>({url: url, data: pick(formData.value, fileds)}).then(res => {
  //       if (res.statusCode === 200) {
  //         dialogVisible.value = false
  //         resetForm(formRef.value)
  //         ElMessage.success('保存成功')
  //         emit('close')
  //       } else {
  //         ElMessage.error('保存失败')
  //       }
  //     })
  //   } else {
  //     console.log('error', fields)
  //   }
  // })
}


</script>

<style lang="scss" scoped>
.class {
}
</style>