<template>
  <div>
    <div class="container">
      <ToolBar
          @search="handleSearch"
          @reset="getData(url.getPageSet,[])"
      >
        <template #toolBtn>
          <el-button type="primary" @click="dialogVisible = true">新增</el-button>
          <el-button type="danger" @click="handleDeleteBatch">删除</el-button>
        </template>
        <template #toolForm>
          <el-form-item>
            <el-input v-model="queryParam.userName" placeholder="请输入用户名" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.cellphone" placeholder="请输入绑定手机号" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.cellphone" placeholder="请输入绑定邮箱" clearable/>
          </el-form-item>
        </template>
      </ToolBar>
      <Table
          ref="tableRef"
          :data="tableData"
          :columns="columns" border style="width:100%;"
          :pagination="pagination"
          @page-current-change="changeData"
          @page-size-change="changeData"
          :selection="true"
          :auto-height="true"
      >
        <template #status="{scope}">
          <el-tag
              :type="scope.row.status === '启用' ? 'success' : scope.row.status === '禁用' ? 'danger' : ''"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
        <template #action="{scope}">
          <!--          <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">编辑</el-button>-->
          <!--          <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">删除</el-button>-->
          <a class="blue" @click="handleEdit(scope.$index, scope.row)">编辑</a>
          <el-divider direction="vertical"/>
          <a class="red" @click="handleDelete(scope.$index, scope.row)">删除</a>
        </template>
      </Table>
    </div>
    <UserForm ref="formRef" v-model:visible="dialogVisible" :data="formData" @close="getData(url.getPageSet,[])"></UserForm>

  </div>
</template>

<script setup lang="ts" name="user">
import {ref, reactive, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {useTable} from '@/hooks/useTable'
import {useForm} from '@/hooks/useForm'
import ToolBar from "@/components/ToolBar/index.vue";
import Table from '@/components/Table'
import UserForm from "./UserForm.vue";
import type {FormInstance} from "element-plus";
import request from "@/utils/axios";
import BaseSelect from "@/components/BaseSelect"

const {tableData, pagination, getData, changeData} = useTable()
const {handleAdd} = useForm()
const tableRef = ref()
const formRef = ref()
const columns: TableColumnsList = [
  {label: "登录名", prop: "userNameId", align: "center", width: 120},
  {label: "姓名", prop: "userName", align: "center", width: 100},
  {label: "角色", prop: "userGroupName", align: "center", width: 300},
  {label: "机构", prop: "orgName", align: "center", width: 200},
  // {label: "状态", prop: "status", align: "center",},
  {label: "绑定手机号", prop: "cellphone", align: "center", width: 120},
  {label: "绑定邮箱", prop: "email", align: "center", width: 200},
  {label: "服务到期日期", prop: "date", align: "center",},
  {label: "创建时间", prop: "createTime", align: "center", width: 200},
  {label: "创建人", prop: "creator", align: "center", width: 100},
  {label: "操作", prop: "action", align: "center", width: 120, fixed: 'right'},
]
const INITIAL_DATA = {
  uuid: '',
  userNameId: '',
  userName: '',
  userGroupName: '',
  orgAllName: '',
  status: '1',
  cellphone: '',
  email: '',
  date: '',
  createTime: '',
  creator: '',
  userGroup: '',
  orgId: '',
  password: '',
  idss: ''
}

const formData = ref({...INITIAL_DATA})
const state = reactive({
  formData:{
    uuid: '',
    userNameId: '',
    userName: '',
    userGroupName: '',
    orgAllName: '',
    status: '1',
    cellphone: '',
    email: '',
    date: '',
    createTime: '',
    creator: '',
    userGroup: '',
    orgId: '',
    password: '',
    idss: ''
  }
})
const dialogVisible = ref(false)
const queryParam = reactive({
  userName: '',
  cellphone: '',
  email: '',
  dict:'',
});
const url = reactive({
  getPageSet: '/system/user/getPageSet',
  delete: "/system/user/delete",
  detail: "/system/user/getDetailByUuid",
})

// 查询操作
const handleSearch = () => {
  getData(url.getPageSet, queryParam);
};

handleAdd(formRef)

const handleEdit = (index: number, row: any) => {
  request.post<any>({url: url.detail, data: {uuid: row.uuid}}).then(res => {
    if (res.statusCode === 200) {
      formData.value = res.data
    }
  })
  dialogVisible.value = true
};

// 删除操作
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {type: 'warning'}).then(() => {
    request.post({url: url.delete, data: {uuid: row.uuid}}).then(res => {
      if (res.statusCode === 200) {
        ElMessage.success('删除成功');
        getData(url.getPageSet, []);
      } else {
        ElMessage.error('删除失败')
      }
    })
  }).catch(() => {
  });
};

const handleDeleteBatch = () => {
  const {getSelectionRows} = tableRef.value.getTableRef()
  const selectionRows = getSelectionRows()
  let uuids: any[] = []
  selectionRows.forEach(e => {
    uuids.push(e.uuid)
  })
  ElMessageBox.confirm('确定要删除吗？', '提示', {type: 'warning'}).then(() => {
    request.post({url: url.delete, data: {uuid: uuids.toString()}}).then(res => {
      if (res.statusCode === 200) {
        ElMessage.success('删除成功');
        getData(url.getPageSet, []);
      } else {
        ElMessage.error('删除失败')
      }
    })
  }).catch(() => {
  });
}

onMounted(() => {
  getData(url.getPageSet, []);
});
</script>

<style lang="scss" scoped>
.blue {
  color: #6ca3f5;
}

.red {
  color: #F56C6C;
}


</style>