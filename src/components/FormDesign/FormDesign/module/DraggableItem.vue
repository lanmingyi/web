<!--拖拽组件-->
<template>
  <div>
    <div>{{title}}</div>
<!--    <draggable-->

<!--    ></draggable>-->
  </div>

</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

defineOptions({
  name: "DraggableItem"
})
const props = defineProps({
  title: {
    type: String
  }
})
const {title} = props

</script>

<style scoped>

</style>