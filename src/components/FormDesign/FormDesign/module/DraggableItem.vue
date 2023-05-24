<!--拖拽组件-->
<template>
  <div class="com-content">
    <div class="com-title">{{ title }}</div>
    <!--     ===设置为true时拖拽才能滚动====-->
    <Draggable
        :list="list"
        :animation="100"
        item-key="type"
        class="list-group"
        :forceFallback="true"
        ghost-class="ghost"
        @change="$emit('handleListPush', list)"
    >
      <template #item="{ element }">
        <div class="items">
          <div class="title" @click="handleClick">{{ element.label }}</div>
          <!--        <button @click.stop="fold(element)">{{element.isflod ? '展开' : '收起'}}</button>-->
        </div>
      </template>
    </Draggable>


    <!--    <Draggable-->
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
    <!--      <template #item="{ element }">-->
    <!--        <li-->
    <!--            v-for="(val, index) in list"-->
    <!--            :key="index"-->
    <!--            @dragstart="$emit('generateKey', list, index)"-->
    <!--            @click="$emit('handleListPush', val)"-->
    <!--        >-->
    <!--        <span v-if="['icon', 'color', 'userPop', 'depart', 'codeTag', 'area'].includes(val.type)">-->
    <!--&lt;!&ndash;          <el-icon :type="val.icon"></el-icon>&ndash;&gt;-->
    <!--          <el-icon><CirclePlus /></el-icon>-->
    <!--        </span>-->
    <!--          <span v-else>-->
    <!--          <svg v-if="val.icon" class="icon" aria-hidden="true">-->
    <!--            <use :xlink:href="`#${val.icon}`"></use>-->
    <!--          </svg>-->
    <!--        </span>-->
    <!--          {{ element.label }}-->
    <!--        </li>-->
    <!--      </template>-->
    <!--    </Draggable>-->
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'

defineOptions({
  name: "DraggableItem"
})

const emit = defineEmits(['start'])
const props = defineProps({
  title: {
    type: String
  },
  list: {
    type: Object
  }
})
const {title, list} = props

const handleClick = () =>{
  console.log('111111111111')
}

const handleStart = (e, list) => {
  emit('start', list[e.oldIndex].type || list[e.oldIndex]);
}

</script>

<style scoped lang="scss">
.items {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  background: #e3e3e3;
  border-radius: 8px;

  //padding      : 0px;
  //list-style   : none;
  //display      : flex;
  //margin-bottom: 0;
  //flex-wrap    : wrap;
  //// background: #efefef;
}

</style>