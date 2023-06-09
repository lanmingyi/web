<template>
  <el-dialog :title="title" draggable>
    <el-form :model="formData" ref="ruleFormRef" :rules="rules">
      <el-form-item label="菜单类型" :label-width="formLabelWidth" prop="menuType">
        <el-radio-group v-model="formData.menuType">
          <el-radio :label="0">一级菜单</el-radio>
          <el-radio :label="1">子菜单</el-radio>
          <el-radio :label="2">按钮/权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="formData.name" autocomplete="off"/>
      </el-form-item>

      <el-form-item v-show="formData.menuType !== 0" label="上级菜单" :label-width="formLabelWidth" :required="true">
        <el-tree-select
            style="width: 100%"
            :data="treeData"
            v-model="formData.parentId"
            check-strictly
            placeholder="请选择父级菜单"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="菜单路径" :label-width="formLabelWidth" prop="url">
        <el-input v-model="formData.url" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="前端组件" :label-width="formLabelWidth" prop="component">
        <el-input v-model="formData.component" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="资源排序" :label-width="formLabelWidth" prop="sortNo">
        <el-input v-model="formData.sortNo" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="资源图标" :label-width="formLabelWidth">
        <el-input disabled v-model="formData.icon" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="是否路由菜单" :label-width="formLabelWidth">
        <el-switch v-model="formData.route"
                   active-text="是"
                   inactive-text="否"
                   :active-value="true"
                   :inactive-value="false"/>
      </el-form-item>
      <el-form-item label="开启缓存该路由" :label-width="formLabelWidth">
        <el-switch v-model="formData.keepAlive"
                   active-text="开启"
                   inactive-text="关闭"/>
      </el-form-item>
      <el-form-item label="开启子节点" :label-width="formLabelWidth">
        <el-switch v-model="formData.state"
                   active-text="开启"
                   inactive-text="关闭"
                   active-value="closed"
                   inactive-value="open"/>
      </el-form-item>

      <el-form-item label="隐藏路由" :label-width="formLabelWidth">
        <el-switch active-text="是"
                   inactive-text="否"
                   :active-value="true"
                   :inactive-value="false"
                   v-model="formData.hidden" />
      </el-form-item>
<!--      <el-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="聚合路由">-->
<!--        <el-switch checkedChildren="是" unCheckedChildren="否" v-model="model.alwaysShow" />-->
<!--      </el-form-item>-->
<!--      <el-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="打开方式">-->
<!--        <el-switch checkedChildren="外部" unCheckedChildren="内部" v-model="model.internalOrExternal" />-->
<!--      </el-form-item>-->
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

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = 120;
const emit = defineEmits(['close']);
const formData = ref(props.data);
const treeData = ref<any []>([])


watch(() => props.data,
    (val) => {
      formData.value = val;
    },
    {deep:true}
)
watch(() => formData.value.menuType,
    val => {
      if(val !== 1){
        request.get({url: '/sys/permission/queryTreeList'}).then(res=>{
          treeData.value = res.result.treeList
        })
      }
    },
    {immediate: true}
)

const title = computed(() => {
  return formData.value && formData.value.id ? '编辑菜单节点' : '新增菜单节点'
});

const onCencel = () => {
  emit('close');
};

const onSubmit = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      const isEdit = formData.value.id;
      const url = isEdit ? '/sys/permission/edit' : '/sys/permission/add';
      request.post({url: url, data: formData.value}).then((res) => {
        if (res.code === 200) {
          ElMessage({type: 'success', message: res.message});
          emit('close',);
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

</script>

<style lang="scss" scoped></style>
