<!--表单设计器-->
<template>
  <!--  <el-config-provider :local="local">-->
  <div :class="['form-designer-container', ]">
    <!-- 最顶部操作区域-->
    <form-design-operate v-if="toolbarTop" :showToolbarText="showToolbarText" :toolbar="toolbar" :emptyElement="true"
                         @handleSave="handleSave" @handlePreview="handlePreview"
                         @handleOpenImportJsonModal="handleOpenImportJsonModal"
                         @handleOpenCodeModal="handleOpenCodeModal"
                         @handleOpenJsonModal="handleOpenJsonModal" @handleClose="handleClose"
    >
      <template slot="left-action">
        <slot name="left-action"></slot>
      </template>
      <template slot="right-action">
        <slot name="right-action"></slot>
      </template>
    </form-design-operate>

    <!-- 整体内容    -->
    <div class="content" :class="{
        'show-head': showHead,
        'toolbar-top': toolbarTop,
        'show-head-and-toolbar-top': toolbarTop && showHead
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
        <!-- 中间面板操作区域-->
        <form-design-operate
            v-if="!toolbarTop"
            :toolbar="toolbar"
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

        <!-- 中间面板表单区域-->
        <form-design-panel
            ref="formDesignPanelRef"
            :class="{'no-toolbar-top': !toolbarTop }"
            :formData="formData"
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
                @handleHide="showProperties = false"
            />
          </el-tab-pane>
          <el-tab-pane name="2" label="表单属性">
            <form-properties :config="formData.config"/>
          </el-tab-pane>
        </el-tabs>
      </aside>
    </div>
  </div>
  <!--  </el-config-provider>-->
</template>

<script setup lang="ts">
import {ref, reactive, computed, toRefs, getCurrentInstance} from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {ElMessageBox, ElMessage} from "element-plus";
import FormDesignOperate from "@/components/FormDesign/FormDesign/module/FormDesignOperate.vue";
import FormDesignPanel from "@/components/FormDesign/FormDesign/module/FormDesignPanel.vue";
import DraggableItem from "@/components/FormDesign/FormDesign/module/DraggableItem.vue";
import ImportJson from "@/components/FormDesign/FormDesign/module/ImportJson.vue";
import ViewJson from "@/components/FormDesign/FormDesign/module/ViewJson.vue";
import ViewCode from "@/components/FormDesign/FormDesign/module/ViewCode.vue";
import FormItemProperties from "@/components/FormDesign/FormDesign/module/FormItemProperties.vue";
import FormProperties from "@/components/FormDesign/FormDesign/module/FormProperties.vue";
import FormPreview from "@/components/FormDesign/FormPreview/index";
import draggable from 'vuedraggable'

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
  toolbarTop: {
    type: Boolean,
    default: false,
  },
  showToolbarText: {
    type: Boolean,
    default: false,
  },
  toolbar: {
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
  hideModel: {
    // 隐藏数据字段
    type: Boolean,
    default: false,
  },
})
const local = zhCn
const internalInstance = getCurrentInstance()

const emit = defineEmits(['save', 'close'])
const {fields} = toRefs(props)
const formData = reactive<any>({
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
const formPreviewRef = ref()
const formDesignPanelRef = ref()
const noModel = reactive(["button", "divider", "card", "grid", "table", "alert", "text", "html",])
const selectItem = reactive({key: ""})
const updateTime = ref(0)
const startType = ref('')
const showProperties = ref(false)

const basicsArray = computed(() => {
  // console.log('basicsList.filter((item) => fields.value.includes(item.type))', basicsList.filter((item) => fields.value.includes(item.type)))
  return basicsList.filter((item) => fields.value.includes(item.type));
})
const layoutArray = computed(() => {
  return layoutList.filter((item) => fields.value.includes(item.type))
})

const handleDownload = () => {
}
const generateKey = (list, index) => {
  // 生成key值
  const key = list[index].type + '_' + new Date().getTime()
  list[index] = {
    ...list[index],
    key,
    model: key,
  }
  if (noModel.includes(list[index].type)) {
    // 删除不需要的model属性
    delete list[index].model
  }
}

const handleListPush = (item) => {
  // 双击控件按钮push到list
  if (!selectItem.key) {
    // 在没有选择表单时，将数据push到formData.list
    const key = item.type + "_" + new Date().getTime();
    item = {
      ...item,
      key,
      model: key,
    };
    if (noModel.includes(item.type)) {
      // 删除不需要的model属性
      delete item.model;
    }
    const itemString = JSON.stringify(item);
    const record = JSON.parse(itemString);
    // 删除icon及component属性
    delete record.icon;
    delete record.component;
    formData.list.push(record);
    handleSetSelectItem(record);
    return false;
  }
  formDesignPanelRef.value.handleCopy(false, item)
}

const handleSetSelectItem = (record) => {
  // 操作间隔不能低于100毫秒
  let newTime = new Date().getTime();
  if (newTime - updateTime.value < 100) {
    return false;
  }
  updateTime.value = newTime;
  // 设置selectItem的值
  selectItem.key = record;
  // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
  if (record.key) {
    startType.value = record.type;
    showProperties.value = true;
  } else {
    showProperties.value = false;
  }
}

const handleReset = () => {
  ElMessageBox.confirm("是否确认清空内容?", "警告", {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  }).then(res => {
    formData.list = [];
    handleSetSelectItem({key: ""});
    ElMessage({type: 'success', message: '已清空'})
  }).catch(() => {
    ElMessage({type: 'info', message: '失败'})
  })
}

const handlePreview = () => {
  formPreviewRef.value.formDesignData = formData
  formPreviewRef.value.previewWidth = formData.config.width
  formPreviewRef.value.visible = true
}

const handleOpenImportJsonModal = () => {
}
const handleOpenCodeModal = () => {
}
const handleOpenJsonModal = () => {
}

const handleStart = (type) => {
  //操作数据后更新视图
  internalInstance!.ctx.$forceUpdate()
  console.log('type', type)
  startType.value = type
}
const handleSave = () => {
  emit('save', JSON.stringify(formData))
}

const handleClose = () => {
  emit('close')
}

</script>
<style scoped lang="scss">
@import "../assets/css/k-form-design";
</style>