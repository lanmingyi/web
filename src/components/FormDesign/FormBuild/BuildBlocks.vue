<!--表单设计布局组件-->
<template>
  <!--  标签页布局-->
  <el-tabs v-if="formItem.type==='tabs'">
    <el-tab-pane
        v-for="(tabItem, index) in formItem.columns"
        :key="tabItem.name"
        :label="tabItem.label"
        :name="tabItem.name"
    >
      <build-blocks
          ref="nestedComponents"
          @handleRest="$emit('handleReset')"
          @change="handleChange"
          v-for="(item) in tabItem.list"
          :disabled="disabled"
          :dynamic-data="dynamicData"
          :form-config="formConfig"
          :config="config"
          :key="item.key"
          :form-item="item"
          v-bind="$attrs"
      ></build-blocks>
    </el-tab-pane>
  </el-tabs>
  <!--  栅格布局-->
  <el-row v-else-if="formItem.type==='grid'">
    <el-col
        v-for="(colItem, index) in formItem.columns"
        :span="colItem.span || 0"
    >
      <build-blocks
          ref="nestedComponents"
          @handleRest="$emit('handleReset')"
          @change="handleChange"
          v-for="(item) in colItem.list"
          :disabled="disabled"
          :dynamic-data="dynamicData"
          :form-config="formConfig"
          :config="config"
          :key="item.key"
          :form-item="item"
          v-bind="$attrs"
      ></build-blocks>
    </el-col>
  </el-row>
  <!--  卡片布局-->
  <el-card v-else-if="formItem.type === 'card'" :header="formItem.label">
    <build-blocks
        ref="nestedComponents"
        @handleRest="$emit('handleReset')"
        @change="handleChange"
        v-for="(item) in formItem.list"
        :disabled="disabled"
        :dynamic-data="dynamicData"
        :form-config="formConfig"
        :config="config"
        :key="item.key"
        :form-item="item"
        v-bind="$attrs"
    ></build-blocks>
  </el-card>
  <!--  表格布局-->
  <el-table v-else-if="formItem.type === 'table'">
    <tr v-for="(trItem, trIndex) in formItem.trs" :key="trIndex">
      <td
          class="table-td"
          v-for="(tdItem, tdIndex) in trItem.tds"
          :key="tdIndex"
          :colspan="tdItem.colspan"
          :rowspan="tdItem.rowspan"
      >
        <build-blocks
            ref="nestedComponents"
            @handleRest="$emit('handleReset')"
            @change="handleChange"
            v-for="(item) in tdItem.list"
            :disabled="disabled"
            :dynamic-data="dynamicData"
            :form-config="formConfig"
            :config="config"
            :key="item.key"
            :form-item="item"
            v-bind="$attrs"
        ></build-blocks>
      </td>
    </tr>
  </el-table>
  <!-- 多级表头 -->
  <div v-else-if="formItem.type === 'nestedColumn'">
    <build-blocks
        ref="nestedComponents"
        @handleRest="$emit('handleReset')"
        @change="handleChange"
        v-for="(item) in formItem.list"
        :disabled="disabled"
        :dynamic-data="dynamicData"
        :form-config="formConfig"
        :config="config"
        :key="item.key"
        :form-item="item"
        v-bind="$attrs"
    ></build-blocks>
  </div>
  <!-- 隐藏内容 -->
  <div v-else-if="formItem.type === 'hidden'">
  </div>

  <div :class="[formConfig.columns === 'two' ? 'flexColumnsItem' : '']" v-else>
    <form-item
        :class="[formItem.options.hidden ? 'hiddenItem' : '']"
        ref="nestedComponents"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
        :disabled="formItem.options.disabled"
        :dynamicData="dynamicData"
        :key="formItem.key"
        :record="formItem"
        :tableName="tableName"
        :isMultiForm="isMultiForm"
        :formConfig="formConfig"
        :config="config"
        :formUuid="formUuid"
        v-bind="$attrs"
    >
    </form-item>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  formItem: {
    type: Object,
    required: true,
  },
  tableName:{
    type: String
  },
  isMultiForm:{
    type: String
  },
  disabled: {
    type: Boolean,
    required: true
  },
  dynamicData: {
    type: Object,
    required: true
  },
  formConfig: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  },
  formUuid: {
    type: String,
  },
})

const emit = defineEmits(['change'])

const handleChange = (value, key) => {
  emit('change', value, key)
}
</script>

<style scoped>

</style>