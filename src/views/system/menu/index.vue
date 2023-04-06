<template>
  <div class="menu-container">
    <ToolBar>
      <template #toolBtn>
        <el-button type="primary" @click="handleAddNode()">新增根节点</el-button>
      </template>
    </ToolBar>
    <!--    lazy :load="loadExpand" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"-->
    <Table :data="tableData" style="width: 100%" row-key="id" border :selection="true" :autoHeight="true">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="menuType" label="资源类型"/>
      <el-table-column prop="component" label="组件名"/>
      <el-table-column prop="action" label="操作" :width="250">
        <template #default="{ row }">
          <span class="action-btn" @click="handleAddNode(row)">添加节点</span>
          <el-divider direction="vertical"/>
          <span class="action-btn" @click="handleEditNode(row)">编辑</span>
          <el-divider direction="vertical"/>
          <span class="action-btn-danger" @click="handleDeleteNode(row)">删除</span>
        </template>
      </el-table-column>
    </Table>
    <MenuDialog
        v-model="dialogToggle"
        :menuData="dialogUsingData"
        @close="closeDialog"
        ref="formDialog"
    />
  </div>
</template>

<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus';
import Table from '@/components/Table/index.vue';
import ToolBar from "@/components/ToolBar/index.vue";
import type {MenuData} from './types';
import {ref, reactive, onMounted} from 'vue';
import request from '@/utils/axios';
import MenuDialog from './MenuDialog.vue';
import {pick} from 'lodash';

const url = {
  getListByLevel: '/sys/permission/list',
  getListByPid: '/system/menu/getListByPid',
  delete: '/sys/permission/delete',
};

const levelId = 1;
const dialogToggle = ref<boolean>(false);
const dialogUsingData = ref<MenuData | null>(null);
const tableData: Array<MenuData> = reactive<Array<MenuData>>([]);
const resolveMap = new Map();

onMounted(() => {
  getData();
});

const getData = (pid = null) => {
  if (pid && resolveMap.has(pid)) {
    const {row, resolve} = resolveMap.get(pid);
    row && resolve && loadExpand(row, null, resolve);
  } else {
    request.get({url: url.getListByLevel, params: {levelId}}).then(res => {
      const data = addHasChildrenAttribute(res.result);
      tableData.length = 0;
      tableData.push(...data);
    })
  }
}

const loadExpand = (row, node, resolve) => {
  const pid = row.id;
  resolveMap.set(row.id, {row, resolve})
  request.post<any>({url: url.getListByPid, data: {pid}}).then(res => {
    const children = addHasChildrenAttribute(res.data);
    if (children.length === 0) children.length = 1;
    resolve(children);
  })
}

const addHasChildrenAttribute = (menuList) => {
  const data = menuList.map((menu) => {
    return {
      ...menu,
      // hasChildren: menu.hasChildren ?? true,
    }
  })
  return data;
}

const handleDeleteNode = (row) => {
  const {uuid, pid} = row;
  ElMessageBox.confirm('删除操作将不可逆，确认要删除吗?', '警告',
      {
        closeOnClickModal: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    request.post<any>({url: url.delete, data: {uuid}}).then((res) => {
      if (res.statusCode === 200 || res === 1) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        //输入pid参数，刷新pid
        getData(pid);
      } else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    })
  });
}

const handleAddNode = (row = null as MenuData | null) => {
  const pid = row ? row.id : 1;
  const usingData = {pid};
  dialogUsingData.value = usingData;
  dialogToggle.value = true;
}

const handleEditNode = (row) => {
  dialogUsingData.value = pick(row, ['id', 'pid', 'menuType', 'name', 'url', 'component', 'sortNo', 'iconCls', 'keepAlive', 'status', 'state', 'levelId']);
  dialogToggle.value = true;
}

const closeDialog = (pid = null) => {
  pid && getData(pid);
  dialogToggle.value = false;
  dialogUsingData.value = null;
}

</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
}
</style>
