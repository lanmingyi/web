<!--拖拽组件-->
<template>
  <div class="com-content">
    <div class="com-title">{{ title }}</div>
    <draggable
        class="list-group"
        :list="list"
        group="people"
        itemKey="label"
        @change="log"
    >
      <template #item="{ element }">
        <div class="list-group-item">{{ element.label }}</div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

defineOptions({
  name: "DraggableItem"
})

const emit = defineEmits(['start','handleListPush'])
const props = defineProps({
  title: {
    type: String
  },
  list: {
    type: Object
  }
})
const {title, list} = props
// console.log('list', list)

const log = (evt) => {
  window.console.log(evt);
  emit('start')
  // emit('handleListPush', list)
}

</script>

<style scoped lang="scss">
.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.items {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;

  //padding      : 0px;
  //list-style   : none;
  //display      : flex;
  //margin-bottom: 0;
  //flex-wrap    : wrap;
  //// background: #efefef;
}

</style>