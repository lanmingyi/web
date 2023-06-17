<template>
  <el-collapse :model-value="activeNames">
    <el-collapse-item v-for="(item, key) in dataList" :name='item.name' v-show="item.show">
      <template #title>
        <p>
          <span style="color:#409EFF;">▋ </span>
          <span>{{ item.title }}</span>
        </p>
      </template>
      <slot :name="item.slot"></slot>
    </el-collapse-item>
  </el-collapse>

</template>

<script setup lang="ts">
defineOptions({
  name: "CollapsePanel"
})

const props = defineProps({
  activeNames:{
    type:[Array, String],
    default: () => {
      return(['1'])
    }
  },
  /** left, right*/
  expandIconPosition:{
    type: String,
    default: 'right'
  },
  bordered:{
    type: Boolean,
    default: false
  },
  customStyle: {
    type: String,
    default: 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'
  },
  dataList:{
    type: Array
  }
})

</script>

<style scoped>

</style>