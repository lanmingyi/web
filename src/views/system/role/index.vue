<template>
  <div>
    <div class="container">
      <ToolBar
          @search="handleSearch"
          @reset="getData(url.getPageSet,[])"
      >
        <template #toolBtn>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="danger" @click="handleDeleteBatch">删除</el-button>
        </template>
        <template #toolForm>
          <el-form-item>
            <el-input v-model="queryParam.text" placeholder="请输入角色名称" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParam.organzitionId" placeholder="请输入机构" clearable/>
          </el-form-item>
        </template>
      </ToolBar>
      <Table
          ref="tableRef"
          :data="tableData"
          :columns="columns" border
          :pagination="pagination"
          @page-current-change="changeData"
          @page-size-change="changeData"
          :selection="true"
          :auto-height="true"
      >
        <template #action="{ scope }">
          <a class="blue" @click="handleEdit(scope.$index, scope.row)">编辑</a>
          <el-divider direction="vertical"/>
          <a class="red" @click="handleDelete(scope.$index, scope.row)">删除</a>
        </template>
      </Table>
    </div>
    <RoleForm v-model:visible="drawerVisible" :data="formData" :url="url"
              @close="getData(url.getPageSet,[])"></RoleForm>

  </div>
</template>

<script setup lang="ts" name="role">
import {ref, unref, toRefs, reactive, onMounted, watch} from 'vue';
import {ElMessage, ElMessageBox, ElTable} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {useTable} from '@/hooks/useTable';
import Table from '@/components/Table/index.vue'
import ToolBar from "@/components/ToolBar/index.vue";
import request from "@/utils/axios";
import RoleForm from "./RoleForm.vue";
import {method} from "lodash-es";

const {tableData, pagination, getData, changeData} = useTable()
const tableRef = ref()
// const columns: TableColumnsList = [
const columns = [
  // {label: "所属机构", prop: "orgName", align: "center",},
  {label: "角色名称", prop: "roleName", align: "center",},
  {label: "角色编码", prop: "roleCode", align: "center",},
  {label: "创建时间", prop: "createTime", align: "center",},
  {label: "创建人", prop: "createBy", align: "center",},
  {label: "操作", prop: "action", align: "center",},
]
const INITIAL_DATA = {
  uuid: '',
  roleName: '',
  roleCode: '',
  roleList: [],
  checkedKeys: [],
  creator: '',
  organzitionId: '',
  usePid: '',
  state: 'closed',
  status: 1,
  levelId: 0,
  pid: 1,
  sort: 1,
  menuId: 1,
  roleType: 'menu',
  roleId: '',
  attributes: [],
  ids: '',

}
const formData = ref({...INITIAL_DATA})
let check: any[] = []

const drawerVisible = ref(false)
const queryParam = reactive({
  text: '',
  organzitionId: '',
});
const url = reactive({
  getPageSet: '/sys/role/list',
  detail: '/system/authGroup/getGrantDetailByUuid',
  getTree: '/sys/role/queryTreeList',
  delete: '/system/authGroup/delete',
})

const handleSearch = () => {
  getData(url.getPageSet, queryParam);
};

const handleAdd = () => {
  formData.value = INITIAL_DATA
  request.get<any>({url: url.getTree}).then(res => {
    formData.value.roleList = res.result.treeList
  })
  // request.get<any>({url: url.getTree}).then(res => {
  //   formData.value.roleList = res.result.treeList
  //   // let sourceData: any[] = []
  //   // let children: any[] = []
  //   // res.data.forEach(e => {
  //   //   if (e.pid === 1) {
  //   //     e.label = e.text
  //   //     e.children = e.state === 'closed' ? [] : ''
  //   //     sourceData.push(e)
  //   //   } else {
  //   //     children.push(e)
  //   //   }
  //   // })
  //   // formData.value.roleList = getFilter(sourceData, children)
  //   // check = []
  //   // formData.value.checkedKeys = getCheckedKeys(formData.value.roleList)
  // })
  drawerVisible.value = true
}


const handleEdit = (index: number, row: any,) => {
  // request.post<any>({url: url.detail, data: {uuid: row.uuid, roleId: row.id, roleType: row.roleType}}).then(res => {
  //   formData.value = res.data
  //
  //   let sourceData: any[] = []
  //   let children: any[] = []
  //   res.data.list.forEach(e => {
  //     if (e.pid === 1) {
  //       e.label = e.text
  //       e.children = e.state === 'closed' ? [] : ''
  //       sourceData.push(e)
  //     } else {
  //       children.push(e)
  //     }
  //   })
  //   formData.value.roleList = getFilter(sourceData, children)
  //   check = []
  //   formData.value.checkedKeys = getCheckedKeys(formData.value.roleList)
  //   formData.value.roleId = row.id
  // })
  formData.value = row
  request.get<any>({url: url.getTree}).then(res => {
    formData.value.roleList = res.result.treeList
  })
  request.get<any>({url: "/sys/permission/queryRolePermission", params: {roleId: row.id}}).then(res => {
    formData.value.checkedKeys = res.result
  })
  drawerVisible.value = true

};

const getFilter = (sourceData, children) => {
  let arr: any[] = []
  if (sourceData) {
    sourceData.forEach(e => {
      children.forEach(c => {
        if (e.id === c.pid) {
          c.label = c.text
          c.children = c.state === 'closed' ? [] : ""
          if (e.children) e.children.push(c)
        }
      })
      if (e.children) { // 子级有数据的时候 循环添加数据
        getFilter(e.children, children)
      }
    })
    arr = sourceData
  }

  return arr
}


const getCheckedKeys = (roleList) => {
  roleList.forEach(e => {
    if (e.children.length === 0) {
      if (e.accessAuth === 1) {
        check.push(e.id)
      }
    } else {
      getCheckedKeys(e.children)

    }
  })
  return check
}
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
  getData(url.getPageSet, [], 'get');
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