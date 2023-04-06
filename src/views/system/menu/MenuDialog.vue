<template>
  <el-dialog :title="title">
    <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules">
      <el-form-item label="资源类型" :label-width="formLabelWidth" prop="menuType">
        <BaseSelect v-model="ruleForm.menuType" dataType="code" dictCode="ResourceType"/>
      </el-form-item>
      <el-form-item label="资源名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="菜单路径" :label-width="formLabelWidth" prop="url">
        <el-input v-model="ruleForm.url" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="前端组件" :label-width="formLabelWidth" prop="component">
        <el-input v-model="ruleForm.component" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="资源排序" :label-width="formLabelWidth" prop="sortNo">
        <el-input v-model="ruleForm.sortNo" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="资源图标" :label-width="formLabelWidth">
        <el-input disabled v-model="ruleForm.iconCls" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="开启缓存该路由" :label-width="formLabelWidth">
        <el-switch v-model="ruleForm.keepAlive"
                   active-text="开启"
                   inactive-text="关闭"/>
      </el-form-item>
      <el-form-item label="开启节点" :label-width="formLabelWidth">
        <el-switch v-model="ruleForm.status"
                   active-text="开启"
                   inactive-text="关闭"
                   :active-value="1"
                   :inactive-value="0"/>
      </el-form-item>
      <el-form-item label="开启子节点" :label-width="formLabelWidth">
        <el-switch v-model="ruleForm.state"
                   active-text="开启"
                   inactive-text="关闭"
                   active-value="closed"
                   inactive-value="open"/>
      </el-form-item>
    </el-form>
    <template #footer>
            <span>
                <el-button @click="onCencel">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type {MenuData} from './types';
import {ElMessage} from 'element-plus';
import type {FormInstance} from "element-plus";
import request from '@/utils/axios';
import {ref, computed, toRefs, reactive, watch} from 'vue';
import {rules} from './utils';
import BaseSelect from '@/components/BaseSelect/index.vue';

interface MenuEditDialogProps {
  menuData: MenuData | null,
}

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = 120;
const props = defineProps<MenuEditDialogProps>();
const emit = defineEmits(['close']);
const {menuData} = toRefs(props);

watch(menuData, (newValue) => {
  const newRuleForm = newValue ? {
    ...defaultForm,
    ...newValue
  } : defaultForm
  ruleForm.value = newRuleForm;
}, {flush: 'post'})

const title = computed(() => {
  return menuData.value && menuData.value.id ? '编辑菜单节点' : '新增菜单节点'
});

const onCencel = () => {
  emit('close');
};

const onSubmit = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      const isEdit = ruleForm.value.id;
      const url = isEdit ? '/sys/permission/edit' : '/sys/permission/add';
      request.post({url: url, data: ruleForm.value}).then((res) => {
        if (res.code === 200) {
          ElMessage({type: 'success', message: res.message});
          emit('close', ruleForm.value.pid || 1);
          //输入pid参数，刷新pid
        } else {
          ElMessage({type: 'error', message: res.message})
        }
      }).catch((err) => {
        err.message && ElMessage({type: 'error', message: err.message});
        console.error(err);
      });
    }
  })


};

const defaultForm: MenuData = {
  id: '',
  pid: null,
  menuType: 'menu',
  name: '',
  keepAlive: null,
  status: 1,
  state: 'open',
  iconCls: 'apartment',
  url: '/',
  component: '',
  sortNo: 1,
  codeSetId: 'menu',
};

const ruleForm = ref({...defaultForm});


</script>

<style lang="scss" scoped></style>
