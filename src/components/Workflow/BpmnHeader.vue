<template>
  <el-button-group>
    <el-tooltip class="box-item" effect="dark" title="保存" placement="top">
      <el-button type="primary" size="default" @click="deploy"><i class="fa fa-save">保存</i></el-button>
    </el-tooltip>
    <el-tooltip effect="dark" titile="打开流程文件" placement="top">
      <el-upload action="" :show-file-list="false" :before-upload="openBpmn" style="display: inline-block">
        <el-button type="primary" size="default"><i class="fa fa-folder-open"></i></el-button>
      </el-upload>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="创建新流程图" placement="top">
      <el-button type="primary" size="default" @click="reset"><i class="fa fa-plus-circle"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="下载流程图" placement="top">
      <el-button type="primary" size="default" @click="downloadSvg"><i class="fa fa-picture-o"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="下载流程文件" placement="top">
      <el-button type="primary" size="default" @click="downloadBpmn"><i class="fa fa-download"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="撤销" placement="top">
      <el-button type="primary" size="default" @click="undo"><i class="fa fa-rotate-left"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="恢复" placement="top">
      <el-button type="primary" size="default" @click="redo">
        <i class="fa fa-rotate-right" :class="!canRedo ? 'default-undo' : ''"></i>
      </el-button>
    </el-tooltip>

    <el-tooltip class="box-item" effect="dark" title="放大" placement="top">
      <el-button type="primary" size="default" @click="zoom(0.05)"><i class="fa fa-search-plus"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="缩小" placement="top">
      <el-button type="primary" size="default" @click="zoom(-0.05)"><i class="fa fa-search-minus"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="自适应屏幕" placement="top">
      <el-button type="primary" size="default" @click="fitViewport"><i class="fa fa-hand-pointer-o"></i></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" title="关闭" placement="top" v-if="bpmnClose">
      <el-button type="primary" size="default" @click="() => {emit('close')}"><i class="fa fa-close"></i></el-button>
    </el-tooltip>

  </el-button-group>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps({
  processData: {
    type: Object
  },
  modeler: {
    type: Object,
    default: {}
  },
  bpmnClose: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['save', 'openBpmn', 'restart', 'handleExportSvg', 'handleExportBpmn', 'fitViewport', 'close'])
const canRedo = ref<boolean>(false)
const scale = ref<number>(1.0)
const deploy = () => {
  let _xml
  let _svg
  props.modeler.saveXML((err, xml) => {
    if (err) {
      console.log('xmlError', err)
    }
    _xml = xml
    emit('save', _xml)
  })
  props.modeler.saveSVG((err, svg) => {
    if (err) {
      console.log('svgError', err)
    }
    _svg = svg
  })
}

const openBpmn = (e) => {
  emit('openBpmn', e)
}

const reset = () => {
  emit('restart')
}

const downloadSvg = () => {
  emit('handleExportSvg')
}

const downloadBpmn = () => {
  emit("handleExportBpmn");
}

function undo() {
  props.modeler.get("commandStack").undo()
  canRedo.value = props.modeler.get('commandStack').canRedo()
}

const redo = () => {
  props.modeler.get('commandStack').redo()
  canRedo.value = props.modeler.get('commandStack').canRedo()
}

const zoom = (val) => {
  let newScale = !val
      ? 1.0
      : scale.value + val <= 0.2
          ? 0.2
          : scale.value + val
  props.modeler.get('canvas').zoom(newScale)
  scale.value = newScale
}

const fitViewport = () => {
  emit('fitViewport')
}
</script>

<style scoped>
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>