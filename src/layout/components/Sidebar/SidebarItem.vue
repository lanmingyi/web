<template>
  <div v-if="!props.item.meta?.hidden" :class="{'simple-mode': props.isCollapse, 'first-level': props.isFirstLevel}">
    <template v-if="!alwaysShow && firstLevelMenu && !firstLevelMenu.children">
      <SidebarItemLink v-if="firstLevelMenu.meta" :to="resolvePath(firstLevelMenu.path)">
        <el-menu-item :index="resolvePath(firstLevelMenu.path)">
          <svg-icon v-if="firstLevelMenu.meta.svgIcon" :name="firstLevelMenu.meta.svgIcon"/>
          <component v-else-if="firstLevelMenu.meta.elIcon" :is="firstLevelMenu.meta.elIcon" class="el-icon"/>
          <template v-if="firstLevelMenu.meta.title" #title>
            {{firstLevelMenu.meta.title}}
          </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>

    <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
      <template #title>
        <svg-icon v-if="props.item.meta && props.item.meta.svgIcon" :name="props.item.meta.svgIcon"/>
<!--        <component v-else-if="props.item.meta && props.item.meta.elIcon" :is="props.item.meta.elIcon" class="el-icon" />-->
        <component v-else-if="props.item.meta && props.item.meta.elIcon || props.item.meta && props.item.meta.icon" :is="props.item.meta.elIcon || props.item.meta.icon" class="el-icon" />
        <span v-if="props.item.meta && props.item.meta.title">{{ props.item.meta.title }}</span>
      </template>
      <template v-if="props.item.children">
        <SidebarItem
            v-for="child in props.item.children"
            :key="child.path"
            :item="child"
            :is-collapse="props.isCollapse"
            :is-first-level="false"
            :base-path="resolvePath(child.path)"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import {type PropType, computed, onMounted} from "vue";
import {type RouteRecordRaw} from "vue-router";
import {isExternal} from "@/utils/validate";
import path from "path-browserify"
import SidebarItemLink from "@/layout/components/Sidebar/SidebarItemLink.vue";

const props = defineProps({
  item:{
    type: Object as PropType<RouteRecordRaw>,
    required: true
  },
  isCollapse:{
    type: Boolean,
    default: false
  },
  isFirstLevel:{
    type: Boolean,
    default: true
  },
  basePath: {
    type: String,
    default: ""
  }

})

const alwaysShow = computed(() => {
  console.log('props.item', props.item)
  // console.log('props.item', props.item)
  return props.item.meta && props.item.meta.alwaysShow
})

const childrenNumber = computed(() => {
  if(props.item.children){
    const children = props.item.children.filter((item) => {
      return !(item.meta && item.meta.hidden)
    })
    return children.length
  }
  return 0
})

// 一级菜单
const firstLevelMenu = computed(() => {
  if(childrenNumber.value > 0) {
    return null
  }
  // if(props.item.children){
  //   for(const child of props.item.children){
  //     if(!child.meta || !child.meta.hidden){
  //       return child
  //     }
  //   }
  // }
  // If there is no children, return itself with path removed,
  // because this.basePath already contains item's path information
  // return {...props.item, path: ""}
  return {...props.item}
})

const resolvePath = (routePath: string) => {
  // console.log('routePath',routePath)
  if(isExternal(routePath)) {
    // console.log('routePath1',routePath)
    return routePath
  }
  if(isExternal(props.basePath)) {
    // console.log('routePath2',routePath)
    return props.basePath
  }
  // console.log('props',props)
  // console.log('routePath',routePath)
  // console.log('path.resolve(props.basePath, routePath)',path.resolve(props.basePath, routePath))
  return path.resolve(props.basePath, routePath)
}

</script>

<style lang="scss" scoped>
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.simple-mode {
  &.first-level {
    :deep(.el-sub-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }
      span {
        visibility: hidden;
      }
    }
  }
}
</style>
