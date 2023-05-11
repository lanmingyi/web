<!--拖拽组件-->
<template>
  <div class="com-content">
    <div class="com-title">{{title}}</div>
    <draggable
        :list="list"
        item-key="name"
        class="list-group"
        ghost-class="ghost"
    >
      <template #item="{ element }">
        <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
          {{ element.name }}
        </div>
      </template>
    </draggable>
<!--    <draggable-->
<!--        tag="ul"-->
<!--        :list="list"-->
<!--        v-bind="{-->
<!--        group: { name: 'form-draggable', pull: 'clone', put: false },-->
<!--        sort: false,-->
<!--        animation: 180,-->
<!--        ghostClass: 'moving',-->
<!--      }"-->
<!--        @start="handleStart($event, list)"-->
<!--    >-->
<!--&lt;!&ndash;      <li&ndash;&gt;-->
<!--&lt;!&ndash;          v-for="(val, index) in list"&ndash;&gt;-->
<!--&lt;!&ndash;          :key="index"&ndash;&gt;-->
<!--&lt;!&ndash;          @dragstart="$emit('generateKey', list, index)"&ndash;&gt;-->
<!--&lt;!&ndash;          @click="$emit('handleListPush', val)"&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        <span v-if="['icon', 'color', 'userPop', 'depart', 'codeTag', 'area'].includes(val.type)">&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <el-icon :type="val.icon"></el-icon>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          <el-icon><CirclePlus /></el-icon>&ndash;&gt;-->
<!--&lt;!&ndash;        </span>&ndash;&gt;-->
<!--&lt;!&ndash;        <span v-else>&ndash;&gt;-->
<!--&lt;!&ndash;          <svg v-if="val.icon" class="icon" aria-hidden="true">&ndash;&gt;-->
<!--&lt;!&ndash;            <use :xlink:href="`#${val.icon}`"></use>&ndash;&gt;-->
<!--&lt;!&ndash;          </svg>&ndash;&gt;-->
<!--&lt;!&ndash;        </span>&ndash;&gt;-->
<!--&lt;!&ndash;        {{ val.label }}&ndash;&gt;-->
<!--&lt;!&ndash;      </li>&ndash;&gt;-->
<!--    </draggable>-->
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

defineOptions({
  name: "DraggableItem"
})

const emit = defineEmits(['start'])
const props = defineProps({
  title: {
    type: String
  },
  list:{
    type: Object
  }
})
const {title} = props

const handleStart = (e, list) => {
  emit('start', list[e.oldIndex].type || list[e.oldIndex]);
}

</script>

<style scoped>

</style>