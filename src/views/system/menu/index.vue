<template>
  <div class="menu-container">
    <ToolBar>
      <template #toolBtn>
<!--        <el-button type="primary" @click="handleAdd()">新增根节点</el-button>-->
        <el-dropdown style="margin-right: 10px" @command="handleCommand">
          <el-button type="primary">新增
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="root">新增根节点</el-dropdown-item>
              <el-dropdown-item command="children">新增子节点</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ToolBar>
    <!--    lazy :load="loadExpand" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"-->
    <Table :data="tableData" style="width: 100%" row-key="id" border :selection="true" :autoHeight="true">
      <el-table-column prop="name" label="菜单名称"/>
      <el-table-column prop="menuType" label="菜单类型">
        <template #default="{ row }">
          <span>{{row.menuType===0 || row.menuType===1 ? '菜单' : '按钮/权限'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标"/>
      <el-table-column prop="url" label="路径"/>
      <el-table-column prop="component" label="组件"/>
      <el-table-column prop="sortNo" label="排序"/>
      <el-table-column prop="action" label="操作" :width="250">
        <template #default="{ row }">
          <span class="blue" @click="handleCommand('children')">添加节点</span>
          <el-divider direction="vertical"/>
          <span class="blue" @click="handleEdit(row)">编辑</span>
          <el-divider direction="vertical"/>
          <span class="red" @click="handleDelete(row)">删除</span>
        </template>
      </el-table-column>
    </Table>
    <MenuDialog
        ref="formDialog"
        v-model="dialogToggle"
        :data="formData"
        @close="closeDialog"
    />
  </div>
</template>

<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus';
import Table from '@/components/Table/index.vue';
import ToolBar from "@/components/ToolBar/index.vue";
import type {MenuData} from './types';
import {onMounted, reactive, ref} from 'vue';
import request from '@/utils/axios';
import MenuDialog from './MenuDialog.vue';
import {pick} from 'lodash';

const url = {
  getList: '/sys/permission/list',
  delete: '/sys/permission/delete',
};

const INITIAL_DATA = {
  id:'',
  pid:'',
  menuType: 0,
  name:'',
  url:'',
  component:'',
  sortNo:'',
  iconCls:'',
  keepAlive:'',
  route: true,
  status:'',
  state:'',
  parentId: '',
  hidden: false
}

const formData = ref({...INITIAL_DATA})

const dialogToggle = ref<boolean>(false);
const dialogUsingData = ref<MenuData | null>();
const tableData: Array<MenuData> = reactive<Array<MenuData>>([]);

onMounted(() => {
  getData();
});

const getData = () => {
  request.get({url: url.getList}).then(res => {
    const data = res.result;
    tableData.length = 0;
    tableData.push(...data);
  })
}

const handleCommand = (command: string | number | object) => {
  formData.value = INITIAL_DATA
  dialogToggle.value = true;
  if(command === 'root') formData.value.menuType = 0
  if(command === 'children') formData.value.menuType = 1
}

const handleEdit = (row) => {
  // formData.value = pick(row, ['id', 'pid', 'menuType', 'name', 'url', 'component', 'sortNo', 'iconCls', 'keepAlive', 'status', 'state']);
  formData.value = row
  dialogToggle.value = true;
}

const handleDelete = (row) => {
  const {id} = row;
  ElMessageBox.confirm('删除操作将不可逆，确认要删除吗?', '警告',
      {
        closeOnClickModal: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    request.delete<any>({url: url.delete, params: {id}}).then((res) => {
      if (res.statusCode === 200 || res === 1) {
        ElMessage({type: 'success', message: res.message,})
        getData();
      } else {
        ElMessage({type: 'error', message: res.message,})
      }
    })
  });
}

const closeDialog = (pid = null) => {
  pid && getData();
  dialogToggle.value = false;
  dialogUsingData.value = null;
}

</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
}
.blue {
  color: #6ca3f5;
}

.red {
  color: #F56C6C;
}

</style>
