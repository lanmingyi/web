<template>
  <ElTable
      :ref="`tableRef${props.key}`"
      v-bind="props"
      v-loading="props.loading"
      :element-loading-text="props.loadingConfig && props.loadingConfig.text || ''"
      :element-loading-spinner="props.loadingConfig && props.loadingConfig.spinner || ''"
      :element-loading-svg="props.loadingConfig && props.loadingConfig.svg || ''"
      :element-loading-background="props.loadingConfig && props.loadingConfig.background || ''"
      :row-style="rowStyleWithHover"
      :height="autoTableHeight"
      @selection-change="handleSelectionChange"
  >
    <template #default>
      <template v-if="slots.default && slots.default().length > 0">
        <VNode v-for="(slot, index) in slotDefault" :key="index" :content="slot"/>
      </template>
      <template v-else>
        <ElTableColumn v-if="props.selection" type="selection"></ElTableColumn>
        <ElTableColumn
            v-for="(column, index) in columns"
            :key="index"
            v-bind="column"
            :header-align="column.headerAlign || props.headerAlign || 'center'"
            :align="column.align || props.alignWhole"
            :show-overflow-tooltip="column.showOverflowTooltip || props.showOverflowTooltip"
        >
          <template #default="scope">
            <slot :name="column.prop" v-if="$slots[column.prop as keyof typeof $slots]" :scope="scope"></slot>
            <span v-else>
              {{ scope.row[column.prop as keyof typeof scope.row] }}
            </span>
          </template>
        </ElTableColumn>
      </template>
    </template>
  </ElTable>
  <div v-if="showPagination">
    <el-row :gutter="10" justify="end" class="pagination-class">
      <ElPagination
          v-bind="props.pagination"
          v-model:page-size="pagination.pageSize"
          v-model:current-page="pagination.pageNo"
          :total="pagination.totalCount"
          :onSizeChange="handleSizeChange"
          :onCurrentChange="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  unref,
  toRefs,
  getCurrentInstance,
  ExtractPropTypes,
  computed,
  onMounted,
  onUnmounted,
  useSlots
} from 'vue';
import Props from './props';
import {ExtendTableProps} from "@/components/Table/types";
import {debounce} from "lodash";
import {VNode} from "@/components/nodeRender";

const slots = useSlots();
const slotDefault = slots.default && slots.default().map((slot) => {
  return {
    ...slot,
    props: {
      ...slot.props,
      headerAlign: slot.props && slot.props.headerAlign || props.headerAlign || 'center',
      align: slot.props && slot.props.align || props.alignWhole,
      showOverflowTooltip: slot.props && slot.props.showOverflowTooltip || props.showOverflowTooltip,
    } as any,
  }
});

const props: ExtractPropTypes<typeof Props> = defineProps({...Props});
const emit = defineEmits(['page-current-change', 'page-size-change']);
const instance = getCurrentInstance();

const {columns, pagination} = toRefs(props);
const contentHeight = ref(0), toolBarHeight = ref(0);
const paginationHeight = computed(() => {
  return showPagination.value ? 62 : 0;
})

// 指针悬浮行内所显示的颜色
const rowStyleWithHover = computed(() => {
  const propsRowStyle = props.rowStyle || {};
  return {
    ...propsRowStyle,
    "--background-color-hover": props.rowHoverBgColor || '',
  }
});

// 自动显示分页器
const showPagination = computed(() => {
  const {totalPage, totalCount, pageSize} = pagination.value;
  if (totalCount <= 0) return false;
  const totalPageNum = totalPage || ~~(totalCount / pageSize);
  return props.autoPagination ? totalPageNum >= 2 : true;
});

// 自动计算高度
const autoTableHeight = computed(() => {
  if (props.autoHeight) {
    return contentHeight.value - toolBarHeight.value - 10 - paginationHeight.value;
  } else {
    if (typeof props.height === 'number') {
      return props.height
    } else if (typeof props.height === 'string') {
      return Number(props.height)
    } else {
      return 600
    }
  }
});

// 自动重新计算高度
const handleResize = debounce(() => {
  const isInit = document.getElementsByClassName("content").length > 0;
  if (isInit && props.autoHeight) {
    contentHeight.value = document.getElementsByClassName("content")[0]?.clientHeight - 30;
    toolBarHeight.value = document.getElementsByClassName("toolbar")[0]?.clientHeight + 5 || 0;
  }
}, 400)

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 从这拿tableRef
function getTableRef() {
  return instance?.proxy?.$refs[`tableRef${props.key}`]
}

function getTableDom() {
  return (getTableRef() as any).$refs
}

// 当前页
const handleCurrentChange = (val: number) => {
  unref(pagination).pageNo = val
  emit('page-current-change', pagination.value)
}

// 分页器大小
const handleSizeChange = (val: number) => {
  unref(pagination).pageSize = val
  emit('page-size-change', pagination.value)
}
const handleSelectionChange = (val) => {
  // console.log(val)
}

defineExpose({
  getTableRef,
  getTableDom
})

</script>

<style lang="scss" scoped>
.pagination-class {
  margin: 15px;
  width: 100%;
}

.el-table :deep(tr) {
  --el-table-row-hover-bg-color: var(--background-color-hover, var(--el-fill-color-light));
}
</style>