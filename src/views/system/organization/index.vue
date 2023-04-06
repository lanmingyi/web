<template>
  <div>
    <div class="container">
      <ToolBar @search="handleSearch" @reset="getTreeData(url.getPageSet, { levelId: 1 })">
        <template #toolBtn>
          <el-dropdown style="margin-right: 10px" @command="handleAdd">
            <el-button type="primary">新增
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="root">新增根机构</el-dropdown-item>
                <el-dropdown-item command="children">新增子机构</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
<!--          <el-button type="danger">删除</el-button>-->
        </template>
        <template #toolForm>
          <el-form-item>
            <el-input v-model="queryParam.text" placeholder="请输入机构名称" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.code" placeholder="请输入机构编码" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.customerCode" placeholder="请输入自定义机构编码" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.authorizationCode" placeholder="请输入授权码" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.leader" placeholder="请输入联系人" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.isTagging" placeholder="请输入是否标注" clearable/>
          </el-form-item>
        </template>
      </ToolBar>
      <Table :data="tableData" :columns="columns" border style="width:100%;" row-key="uuid" lazy
             :load="(row, treeNode, resolve) => { getChildrenData(url.getChildrenData, row, resolve) }"
             :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
             :auto-height="true"
      >
        <template #action="{ scope }">
          <a class="blue" @click="handleEdit(scope.$index, scope.row, tableData)">编辑</a>
          <el-divider direction="vertical"/>
          <a class="red" @click="handleDelete(scope.$index, scope.row)">删除</a>
        </template>
      </Table>
    </div>

    <OrganizationForm v-model:visible="dialogVisible" :data="formData" @close="getTreeData(url.getPageSet, { levelId: 1 })"></OrganizationForm>

  </div>
</template>

<script setup lang="ts">
// defineOptions({
//   name: 'organization'
// })

import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import ToolBar from "@/components/ToolBar/index.vue";
import Table from '@/components/Table'
import request from "@/utils/axios"
import {useTable} from '@/hooks/useTable'
import {useForm} from "@/hooks/useForm";
import OrganizationForm from './OrganizationForm.vue'

const {tableData, pagination, getTreeData, getChildrenData,} = useTable()

const columns: TableColumnsList = [
  {label: "机构名称", prop: "text", width: 200},
  {label: "机构编码", prop: "code", align: "center", width: 100},
  {label: "自定义机构编码", prop: "customerCode", align: "center", width: 200},
  {label: "联系人", prop: "leader", align: "center", width: 200},
  {label: "地址", prop: "address", align: "center",},
  {label: "是否标注", prop: "isTagging", align: "center", width: 120},
  {label: "电话", prop: "telphone", align: "center", width: 200},
  {label: "授权码", prop: "authorizationCode", align: "center",},
  {label: "管理角色", prop: "managementRole", align: "center", width: 200},
  {label: "机构类型", prop: "organizationType", align: "center", width: 100},
  {label: "创建人", prop: "creator", align: "center", width: 100},
  {label: "备注", prop: "remark", align: "center", width: 100},
  {label: "操作", prop: "action", align: "center", width: 120, fixed: 'right'},
]
const INITIAL_DATA = {
  uuid: '',
  text: '',
  customerCode: '',
  leader: '',
  address: '',
  telphone: '',
  remark: '',
  pid: '',
  oldOrgId: '',
  headImg: '',
  homeImg: '',
  addType: '',
  ids: '',
}
const formData = ref({...INITIAL_DATA})
const dialogVisible = ref(false)
const url = reactive({
  getPageSet: '/system/organization/getListByLevelId',
  getChildrenData: '/system/organization/getListByPid',
  search: '/system/organization/getPageSet',
  detail: '/system/organization/getDetailByUuid',
  delete: '/system/organization/delete',

})
const queryParam = reactive({
  text: '',
  code: '',
  customerCode: '',
  leader: '',
  authorizationCode: '',
  isTagging: '',
});

// 查询操作
const handleSearch = () => {
  request.get({url: url.search, params: queryParam, method: 'get'}).then(res => {
        tableData.value = res.data.rows
      }
  )
};
const handleAdd = (command) => {
  formData.value.addType = command
  dialogVisible.value = true
}
const handleEdit = (index: number, row: any, tableData: any) => {
  request.post({url: url.detail, data: {uuid: row.uuid}}).then(res => {
    formData.value = res.data
  })
  dialogVisible.value = true
};

// 删除操作
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {type: 'warning'}).then(() => {
    request.post({url: url.delete, data: {uuid: row.uuid}}).then(res => {
      if (res.statusCode === 200) {
        ElMessage.success('删除成功');
        getTreeData(url.getPageSet, {levelId: 1});
      } else {
        ElMessage.error('删除失败')
      }
    })
  }).catch(() => {
  });
};

onMounted(() => {
  getTreeData(url.getPageSet, {levelId: 1});
});
</script>

<style lang="scss" scoped>
.blue {
  color: #0869fc;
}

.red {
  color: #F56C6C;
}
</style>