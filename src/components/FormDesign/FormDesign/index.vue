<!--表单设计器-->
<template>
  <el-config-provider :local="local">
    <div>
      <!-- 操作区域-->
      <form-design-operate v-if="!toolbarsTop" :toolbars="toolbars" :emptyElement="true">
        <template slot="left-action">
          <slot name="left-action"></slot>
        </template>
        <template slot="right-action">
          <slot name="right-action"></slot>
        </template>
      </form-design-operate>
      <div class="content" :class="{
              'show-head': showHead,
              'toolbars-top': toolbarsTop,
              'show-head-and-toolbars-top': toolbarsTop && showHead,
            }">
        <!-- 左侧控件区域  -->
        <aside class="left">
          <draggable-item
              title="基础控件"
              :list="basicsArray"
              @generateKey="generateKey"
              @handleListPush="handleListPush"
              @start="handleStart"/>

          <draggable-item
              title="布局控件"
              :list="layoutArray"
              @generateKey="generateKey"
              @handleListPush="handleListPush"
              @start="handleStart"/>
          <draggable-item
              title="自定义组件"
              :list="customComponents"
              @generateKey="generateKey"
              @handleListPush="handleListPush"
              @start="handleStart"/>
        </aside>

        <!-- 中间面板区域 -->
        <section>
          <form-design-operate
              v-if="!toolbarsTop"
              :toolbars="toolbars"
              :emptyElement="true" @handleSave="handleSave" @handlePreview="handlePreview"
              @handleOpenImportJsonModal="handleOpenImportJsonModal"
              @handleOpenCodeModal="handleOpenCodeModal" @handleOpenJsonModal="handleOpenJsonModal"
              @handleReset="handleReset" @handleClose="handleClose" @handleDownloads="handleDownload"
          >
            <template slot="left-action">
              <slot name="left-action"></slot>
            </template>
            <template slot="right-action">
              <slot name="right-action"></slot>
            </template>
          </form-design-operate>
          <form-design-panel
              ref="KFCP"
              :class="{ 'no-toolbars-top': !toolbarsTop }"
              :data="data"
              :selectItem="selectItem"
              :noModel="noModel"
              :hideModel="hideModel"
              :startType="startType"
              @handleSetSelectItem="handleSetSelectItem"
          />
          <view-json ref="viewJsonRef"/>
          <view-code ref="viewCodeRef"/>
          <import-json ref="importJsonRef"/>
          <form-preview ref="formPreviewRef"/>
        </section>

        <!-- 右侧控件属性区域 -->
        <aside class="right">
          <el-tabs default-active-key="1">
            <el-tab-pane name="1" label="组件属性" force-render>
              <form-item-properties
                  :class="{ 'show-properties': true }"
                  class="form-item-properties"
                  :selectItem="selectItem"
                  :hideModel="hideModel"
                  @handleHide="showPropertie = false"
              />
            </el-tab-pane>
            <el-tab-pane name="2" label="表单属性">
              <form-properties :config="data.config"/>
            </el-tab-pane>
          </el-tabs>
        </aside>
      </div>
    </div>
  </el-config-provider>

</template>

<script setup lang="ts">
import {reactive, computed, toRefs} from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import FormDesignOperate from "@/components/FormDesign/FormDesign/module/FormDesignOperate.vue";
import DraggableItem from "@/components/FormDesign/FormDesign/module/DraggableItem.vue";
import ImportJson from "@/components/FormDesign/FormDesign/module/ImportJson.vue";
import ViewJson from "@/components/FormDesign/FormDesign/module/ViewJson.vue";
import ViewCode from "@/components/FormDesign/FormDesign/module/ViewCode.vue";
import FormItemProperties from "@/components/FormDesign/FormDesign/module/FormItemProperties.vue";
import FormProperties from "@/components/FormDesign/FormDesign/module/FormProperties.vue";

import {
  basicsList,
  // highList,
  layoutList,
  customComponents,
} from "./config/formItemsConfig";

const props = defineProps({
  showHead: {
    type: Boolean,
    default: true,
  },
  toolbarsTop: {
    type: Boolean,
    default: false,
  },
  toolbars: {
    type: Array,
    default: () => [
      "save",
      "preview",
      "importJson",
      "exportJson",
      "exportCode",
      "reset",
      "close",
    ],
  },
  fields: {
    type: Array,
    default: () => [
      "input",
      "textarea",
      "number",
      "select",
      "checkbox",
      "radio",
      "date",
      "time",
      "rate",
      "slider",
      "uploadFile",
      "uploadImg",
      "cascader",
      "treeSelect",
      "batch",
      "editor",
      "switch",
      "button",
      "alert",
      "text",
      "html",
      "divider",
      "card",
      "tabs",
      "grid",
      "table",
    ],
  },
})
const local = zhCn

const {fields} = toRefs(props)
const data = reactive({
  list: [],
  config: {
    layout: "horizontal",
    labelCol: {xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4},
    wrapperCol: {xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18},
    hideRequiredMark: false,
    customStyle: "",
    columns: "one",
    labelAlign: "right",
    print: false,
    width: 850,
  },
})

const basicsArray = computed(() => {
  return basicsList.filter((item) => fields.value.includes(item.type));
})

</script>
<style scoped>

</style>