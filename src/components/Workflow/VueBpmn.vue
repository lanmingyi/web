<template>
  <div class="main">
    <div class="bpmn-viewer">
      <!--      顶部操作按钮-->
      <bpmn-header
          ref="header"
          class="bpmn-viewer-header"
          :processData="initData"
          :modeler="bpmnModeler"
          @save="saveData"
          @restart="restart"
          @handleExportSvg="handleExportSvg"
          @handleExportBpmn="handleExportBpmn"
          @processSave="processSave"
          @fitViewport="fitViewport"
          @openBpmn="openBpmn"
          @close="() => {$emit('close');}"
      ></bpmn-header>

      <div class="bpmn-viewer-container">
        <div class="bpmn-viewer-content" ref="bpmnViewerRef"></div>
      </div>
    </div>

    <!--    设计面板属性配置-->
<!--    <bpmn-panel-->
<!--        ref="bpmnPanel"-->
<!--        v-if="bpmnModeler"-->
<!--        :modeler="bpmnModeler"-->
<!--        :process="initData"-->
<!--        :isEdit="isEdit"-->
<!--        @updateProcesName="updateProcesName"-->
<!--    ></bpmn-panel>-->
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { ElMessage } from "element-plus"
import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnHeader from "@/components/Workflow/BpmnHeader.vue";
import BpmnPanel from './panel/index.vue'
import templateXml from './data/template'
import flowableModdle from './data/flowable.json'
import activitiModdle from './data/activiti.json'
import customTranslate from "./customTranslate/customTranslate";
import customControlsModule from "./customControls";
import BpmData from "./data/BpmData";
import "./assets/css/vue-bmpn.css";
import "./assets/css/font-awesome.min.css";

const props = defineProps({
  product: {
    type: String
  },
  isEdit: {
    type: Boolean,
  },
  // isInit: {
  //   type: Boolean
  // }
})
const emit = defineEmits(['bpmnSave', 'processSave'])

const initData = reactive({
  id: '',
  key: '',
  name: '',
  xml: '',
  permissionType: '',
})
const bpmnPanel = ref()
const bpmnModeler = ref()
const bpmnViewerRef = ref()
const bpmnPanelRef = ref()
const initTemplate = ref('')
const zoom = ref(1)

const updateProcesName = (e) => {
  initData.name = e
}
// 初始化
const getInitData = () => {
  let processId = new Date().getTime()
  initTemplate.value = templateXml.initTemplate(processId)
  initData.id = "process" + processId
  initData.key = "process" + processId
  initData.name = "流程" + processId
  initData.xml = initTemplate.value
  initData.permissionType = 'all'
}

const init = () => {
  // 支持activiti和flowable
  let moddleExtensions = getModdleExtensions()

  //创建Bpmn对象
  let customTranslateModule = {
    translate: ['value', customTranslate]
  }
  bpmnModeler.value = new BpmnModeler({
    container: bpmnViewerRef.value,  // 容器
    additionalModules: [
      customTranslateModule,
      customControlsModule,
    ],
    moddleExtensions: moddleExtensions,
  })

  //初始化建模容器
  initDiagram(initTemplate.value)
  // 自定义左侧工具栏
  adjustPalette()
}

const initDiagram = (xml) => {
  bpmnModeler.value.importXML(xml, (err) => {
    if (err) {
      ElMessage.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
    } else {
    }
  })
}

// 左侧工具栏
const adjustPalette = () => {
  try {
    // 获取Bpmn设计器实例
    // const djsPalette = bpmnViewerRef.value.children[0].children[1].children[4]
    const djsPalette = bpmnViewerRef.value.children[0].children[1].children[5]
    const palette = djsPalette.children[0]
    const allGroups = palette.children
    // // allGroups[0].style["display"] = "none"
    // allGroups[4].style["display"] = "none"
    // allGroups[5].style["display"] = "none"
    // // allGroups[6].style["display"] = "none"
    // allGroups[7].style["display"] = "none"
  } catch (e) {
    ElMessage.error("自定义画板出错")
  }
}

const getModdleExtensions = () => {
  let moddleExtensions = {}
  if (props.product === 'flowable') {
    moddleExtensions = {
      flowable: flowableModdle
    }
  }
  if (props.product === 'activiti') {
    moddleExtensions = {
      activiti: activitiModdle
    }
  }
  return moddleExtensions
}

// 保存时获取XML数据
const saveData = (data) => {
  let formData = bpmnPanelRef.value.getFormData()
  let parameters = {
    processId: formData.id,
    processKey: formData.key,
    processName: formData.name,
    description: formData.description,
    xml: data,
    formBtnList: formData["formBtnList"],
    formFieldList: formData.formFieldList,
    formNoticeList: formData.formNoticeList,
    permissionType: formData.permissionType,
    permissionValue: formData.permissionValue,
  }
  emit('bpmnSave', parameters)
}

// 新建
const restart = () => {
  let tag = <HTMLElement>document.getElementsByClassName("djs-direct-editing-parent")[0];
  if (tag) {
    tag.style.display = "none";
  }
  let processId = new Date().getTime();
  initTemplate.value = templateXml.initTemplate(processId);
  initData.id = "process" + processId
  initData.key = "process" + processId
  initData.name = "流程" + processId
  initData.xml = initTemplate.value

  initDiagram(initTemplate.value);
}

// 下载
const downloadFile = (filename, data, type) => {
  let a = document.createElement('a')
  let url = window.URL.createObjectURL(
      new Blob([data], {type: type})
  )
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const getProcessElement = () => {
  return bpmnModeler.value.getDefinitions().rootElements[0]
}

// 导出SVG
const handleExportSvg = async () => {
  try {
    const {svg} = await bpmnModeler.value.saveSVG({
      format: true
    })
    downloadFile(getProcessElement().name, svg, "image/svg+xml")
    return svg
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 导出XML
const handleExportBpmn = async () => {
  try {
    let {xml} = await bpmnModeler.value.saveXML({format: true})
    xml = xml.replace(/&lt;/g, "<");
    xml = xml.replace(/&gt;/g, ">");
    downloadFile(`${getProcessElement().name}.xml`, xml, "application/xml")
    return xml
  } catch (err: any) {
    ElMessage.error(err)
  }

}

// 获取流程数据
const processSave = (data) => {
  data.procId = initData.key
  data.name = initData.name
  emit('processSave', data)
}

// 让图能自适应屏幕
const fitViewport = () => {
  zoom.value = bpmnModeler.value.get('canvas').zoom("fit-viewport")
  const bbox =  (document.querySelector('.main .viewport') as any).getBBox()
  const currentViewBox = bpmnModeler.value.get('canvas').viewbox()
  const elementMid = {
    x: bbox.x + bbox.width / 2 - 65,
    y: bbox.y + bbox.height / 2,
  };
  bpmnModeler.value.get("canvas").viewbox({
    x: elementMid.x - currentViewBox.width / 2,
    y: elementMid.y - currentViewBox.height / 2,
    width: currentViewBox.width,
    height: currentViewBox.height,
  });
  zoom.value = (bbox.width / currentViewBox.width) * 1.8;
}

// 打开流程图
const openBpmn = (file) => {
  const reader = new FileReader()
  reader.readAsText(file, "utf-8")
  reader.onload = () => {
    createNewDiagram(reader.result)
  }
  return false
}

const createNewDiagram = async (data) => {
  // 将字符串转换成图显示出来
  // xml = xml.replace(/</g, '&lt;')
  // data = data.replace(/>/g, '&gt;')
  data = data.replace(/<!\[CDATA\[(.+)]]>/g, "&lt;![CDATA[$1]]&gt;");
  data = data.replace(/&#34;/g, '"');
  try {
    await bpmnModeler.value.importXML(data);
  } catch (err: any) {
    // console.error(err.message, err.warnings);
    ElMessage.error(err)
  }
}


onMounted(() => {
  getInitData()
  init()

})
</script>

<style lang="scss">
@import "bpmn-js/dist/assets/diagram-js.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "./assets/css/vue-bmpn.css";
@import "./assets/css/font-awesome.min.css";
.main {
  display: flex;
  height: calc(100vh - 50px - 54px);
}
:deep .djs-container .djs-palette {
  display: block !important;
}
:deep .djs-context-pad {
  display: block !important;
}
</style>