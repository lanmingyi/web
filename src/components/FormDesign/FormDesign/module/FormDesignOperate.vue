<template>
  <div class="operating-area">
    <div class="left-btn-box">
      <el-button :icon="Check" link @click="$emit('handleSave')">保存</el-button>
      <el-button :icon="VideoPlay" link @click="$emit('handlePreview')">预览</el-button>
      <el-button :icon="View" link @click="$emit('handleOpenJsonModal')">查看json</el-button>
      <el-button
          class="copy-btn-main"
          :icon="Document"
          link
          @click="$emit('handleOpenCodeModal')"
      >
        生成代码
      </el-button>
      <el-button
          v-if="emptyElement"
          class="delete-btn"
          :icon="Delete"
          link
          @click="$emit('handleReset')"
      >
        清空
      </el-button>
      <!-- 按钮左侧插槽 -->
      <slot name="left-action"></slot>
    </div>
    <div class="right-btn-box">
      <!-- 按钮右侧插槽 -->
      <slot name="right-action"></slot>
      <a-tooltip title="关闭">
        <a v-if="toolbar.includes('close')" @click="$emit('handleClose')">
          <a-icon type="close"/>
        </a>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Check, VideoPlay, View, Document, Delete} from "@element-plus/icons-vue";

defineOptions({
  name: 'FormDesignOperate'
})

const props = defineProps({
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
  showToolbarText: {
    type: Boolean,
    default: false,
  },
  emptyElement: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

</style>