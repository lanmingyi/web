<template>
  <div class="form-panel">
    <p class="hint-text" v-show="formData.list.length === 0">
      从左侧选择控件添加
    </p>
    <el-form
        class="a-form-box k-form-build"
        :layout="formData.config.layout"
        :labelAlign="formData.config.labelAlign"
        :hideRequiredMark="formData.config.hideRequiredMark"
        :style="formData.config.customStyle"
    >
      <Draggable
          tag="div"
          class="draggable-box"
          style="width: 100%"
          v-bind="{
					group: 'form-draggable',
					ghostClass: 'moving',
					animation: 180,
					handle: '.drag-move',
				}"
          v-model="formData.list"
          @add="deepClone"
          @start="dragStart($event, formData.list)"
      >
        <transition-group
            tag="div"
            name="list"
            class="list-main"
            :class="[
						formData.config.columns === 'two' ? 'flexColumns' : '',
					]"
        >
          <layoutItem
              class="drag-move"
              v-for="record in formData.list"
              :key="record.key"
              :record="record"
              :config="formData.config"
              :selectItem.sync="selectItem"
              :startType="startType"
              :insertAllowedType="insertAllowedType"
              :hideModel="hideModel"
              @dragStart="dragStart"
              @handleSelectItem="handleSelectItem"
              @handleCopy="handleCopy"
              @handleDelete="handleDelete"
              @handleColAdd="handleColAdd"
              @handleShowRightMenu="handleShowRightMenu"
          />
        </transition-group>
      </Draggable>
    </el-form>
    <!-- 右键菜单 start -->
    <div
        v-show="showRightMenu"
        :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
        class="right-menu"
    >
      <ul>
        <li @click="handleDownMerge">
          <el-icon type="caret-down"/>
          向下合并
        </li>
        <li @click="handleRightMerge">
          <el-icon type="caret-right"/>
          向右合并
        </li>
        <li @click="handleAddCol">
          <el-icon type="border-horizontal"/>
          增加一列
        </li>
        <li @click="handleAddRow">
          <el-icon type="border-verticle"/>
          增加一行
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import Draggable from "vuedraggable";
import layoutItem from "./layoutItem";
import "codemirror/mode/javascript/javascript";
import {ref, onMounted, onUnmounted} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
  noModel: {
    type: Array,
    required: true,
  },
  startType: {
    type: String,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  selectItem: {
    type: Object,
    default: () => {
    },
  },
  hideModel: {
    type: Boolean,
    default: false,
  }
})
const {formData, noModel, selectItem} = props
const emit = defineEmits(['handleSetSelectItem'])

const insertAllowedType = [
  "input",
  "textarea",
  "number",
  "select",
  "checkbox",
  "radio",
  "date",
  "time",
  "rate",
  "slider",
  "uploadFile",
  "uploadImg",
  "cascader",
  "treeSelect",
  "switch",
  "text",
  "html",
]
const rightMenuSelectValue = {}
const showRightMenu = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)
const trIndex = ref(0)
const tdIndex = ref(0)
const activeArr: any[] = ref([])

const deepClone = (evt) => {
  const newIndex = evt.newIndex;
  // json深拷贝一次
  const listString = JSON.stringify(formData.list);
  formData.list = JSON.parse(listString);
  // 删除icon及compoent属性
  delete formData.list[newIndex].icon;
  delete formData.list[newIndex].component;
  emit("handleSetSelectItem", formData.list[newIndex], 1);
}
// 添加组件
const handleColAdd = (evt, columns, isCopy = false) => {
  // 重置或者生成key值
  const newIndex = evt.newIndex;
  const key = columns[newIndex].type + "_" + new Date().getTime();
  if (columns[newIndex].key === "" || isCopy) {
    columns[newIndex] = {
      ...columns[newIndex],
      key,
      model: key,
      oldModel: key,
    }
    // set(columns, newIndex, {
    //   ...columns[newIndex],
    //   key,
    //   model: key,
    //   oldModel: key,
    // });
    if (noModel.includes(columns[newIndex].type)) {
      // 删除不需要的model属性
      delete columns[newIndex].model;
    }
    if (typeof columns[newIndex].options !== "undefined") {
      // 深拷贝options
      const optionsStr = JSON.stringify(
          columns[newIndex].options
      );
      columns[newIndex].options = JSON.parse(optionsStr);
    }
    if (typeof columns[newIndex].rules !== "undefined") {
      // 深拷贝rules
      const rulesStr = JSON.stringify(columns[newIndex].rules);
      columns[newIndex].rules = JSON.parse(rulesStr);
    }
    if (typeof columns[newIndex].list !== "undefined") {
      // 深拷贝list
      columns[newIndex].list = [];
    }
    if (typeof columns[newIndex].columns !== "undefined") {
      // 深拷贝columns
      const columnsStr = JSON.stringify(
          columns[newIndex].columns
      );
      columns[newIndex].columns = JSON.parse(columnsStr);
      // 复制时，清空数据
      columns[newIndex].columns.forEach((item) => {
        item.list = [];
      });
    }
    if (columns[newIndex].type === "table") {
      // 深拷贝trs
      const trsStr = JSON.stringify(columns[newIndex].trs);
      columns[newIndex].trs = JSON.parse(trsStr);
      // 复制时，清空数据
      columns[newIndex].trs.forEach((item) => {
        item.tds.forEach((val) => {
          val.list = [];
        });
      });
    }
  }
  // 深拷贝数据
  const listString = JSON.stringify(columns[newIndex]);
  columns[newIndex] = JSON.parse(listString);
  emit("handleSetSelectItem", columns[newIndex], 1);
}

const dragStart = (evt, list) => {
  // 拖拽结束,自动选择拖拽的控件项
  emit("handleSetSelectItem", list[evt.oldIndex]);
}

const handleSelectItem = (record, type) => {
  // 修改选择Item
  emit("handleSetSelectItem", record, type);
}

const handleCopy = (isCopy = true, formData) => {
  const traverse = (array) => {
    array.forEach((element, index) => {
      if (element.key === selectItem.key) {
        if (isCopy) {
          // 复制添加到选择节点后面
          array.splice(index + 1, 0, element);
        } else {
          // 双击添加到选择节点后面
          array.splice(index + 1, 0, formData);
        }
        // 复制完成，重置key值
        const evt = {
          newIndex: index + 1,
        };
        handleColAdd(evt, array, true);
        return;
      } else {
        // if (!isCopy) {
        //   const evt1 = {
        //     newIndex: array.length + 1,
        //   };
        //   array.splice(array.length + 1, 0, formData);
        //   this.handleColAdd(evt1, array, true);
        // }
      }
      if (element.type === "grid" || element.type === "tabs") {
        // 栅格布局
        element.columns.forEach((item) => {
          traverse(item.list);
        });
      } else if (element.type === "card" || element.type === "nestedColumn" || element.type === "hidden") {
        // 卡片布局
        traverse(element.list);
      } else if (element.type === "batch") {
        // 动态表格内复制
        if (
            !isCopy &&
            !insertAllowedType.includes(formData.type)
        ) {
          // 插入不允许的字段时，直接return false
          return false;
        }
        traverse(element.list);
      }
      if (element.type === "table") {
        // 表格布局
        element.trs.forEach((item) => {
          item.tds.forEach((val) => {
            traverse(val.list);
          });
        });
      }
    });
  };
  traverse(formData.list);
}

const handleDelete = () => {
  // 删除已选择
  const traverse = (array) => {
    array = array.filter((element, index) => {
      if (element.type === "grid" || element.type === "tabs") {
        // 栅格布局
        element.columns.forEach((item) => {
          item.list = traverse(item.list);
        });
      }
      if (element.type === "card" || element.type === "batch" || element.type === "nestedColumn" || element.type === "hidden") {
        // 卡片布局
        element.list = traverse(element.list);
      }
      if (element.type === "table") {
        // 表格布局
        element.trs.forEach((item) => {
          item.tds.forEach((val) => {
            val.list = traverse(val.list);
          });
        });
      }
      if (element.key !== selectItem.key) {
        return true;
      } else {
        this.handleSelectItem(array[index], 0);

        return false;
      }
    });
    return array;
  };

  formData.list = traverse(formData.list);
}

const handleDownMerge = () => {
  // 向下合并

  // 判断当前行是否是最后一行，最后一行无法向下合并
  if (
      rightMenuSelectValue.trs.length -
      rightMenuSelectValue.trs[trIndex.value].tds[
          tdIndex.value
          ].rowspan <=
      trIndex.value
  ) {
    ElMessage.error("当前是最后一行，无法向下合并");
    return false;
  }

  // 获取当前单元格的rowspan
  const currentRowspan = rightMenuSelectValue.trs[trIndex.value].tds[tdIndex.value].rowspan;

  // 判断下一列单元格与当前单元格的colspan是否一致，如果不一致则无法合并
  if (
      rightMenuSelectValue.trs[trIndex.value].tds[tdIndex.value].colspan !==
      rightMenuSelectValue.trs[trIndex.value + currentRowspan].tds[tdIndex.value].colspan
  ) {
    ElMessage.error("当前表格无法向下合并");
    return false;
  }

  // 获取下一列单元格的rowspan
  const nextRowSpan =
      rightMenuSelectValue.trs[trIndex.value + currentRowspan]
          .tds[tdIndex.value].rowspan;

  // 当前单元格rowspan等于当前单元格rowspan加上下一列单元格rowspan
  rightMenuSelectValue.trs[trIndex.value].tds[
      tdIndex.value
      ].rowspan = currentRowspan + nextRowSpan;

  // 将被合并的单元rowspan修改为0
  rightMenuSelectValue.trs[trIndex.value + currentRowspan].tds[
      tdIndex.value
      ].rowspan = 0;

  // 清空被合并单元格list
  rightMenuSelectValue.trs[trIndex.value + currentRowspan].tds[
      tdIndex.value
      ].list = [];
}
const handleRightMerge = () => {
  // 向右合并
  // 获取当前列的所有colspan总和
  const sumCols = rightMenuSelectValue.trs[trIndex.value].tds
      .map((item) => item.colspan)
      .reduce(function (partial, value) {
        return partial + value;
      });

  // 判断是否是最后一列，最后一列无法继续向右合并
  if (
      sumCols -
      rightMenuSelectValue.trs[trIndex.value].tds[
          tdIndex.value
          ].colspan <=
      tdIndex.value
  ) {
    ElMessage.error("当前是最后一列，无法向右合并");
    return false;
  }

  // 获取当前单元格的colspan
  const currentColspan =
      rightMenuSelectValue.trs[trIndex.value].tds[tdIndex.value]
          .colspan;

  // 判断需要合并的单元格rowspan是否与当前单元格一致
  if (
      rightMenuSelectValue.trs[trIndex.value].tds[tdIndex.value]
          .rowspan !==
      rightMenuSelectValue.trs[trIndex.value].tds[
      tdIndex.value + currentColspan
          ].rowspan
  ) {
    ElMessage.error("当前表格无法向右合并");
    return false;
  }

  // 合并单元格colspan
  rightMenuSelectValue.trs[trIndex.value].tds[
      tdIndex.value
      ].colspan +=
      rightMenuSelectValue.trs[trIndex.value].tds[
      tdIndex.value + currentColspan
          ].colspan;

  // 将被合并的单元格colspan设置为0
  rightMenuSelectValue.trs[trIndex.value].tds[
  tdIndex.value + currentColspan
      ].colspan = 0;

  // 情况被合并单元格的list
  rightMenuSelectValue.trs[trIndex.value].tds[
  tdIndex.value + currentColspan
      ].list = [];
}
const handleAddCol = () => {
  // 增加列
  rightMenuSelectValue.trs.forEach((item) => {
    item.tds.splice(tdIndex.value + 1, 0, {
      colspan: 1,
      rowspan: 1,
      list: [],
    });
  });
}
const handleAddRow = () => {
      // 增加行
      // 获取总col值
      const sumCols = rightMenuSelectValue.trs[0].tds
          .map((item) => item.colspan)
          .reduce(function (partial, value) {
            return partial + value;
          });
      const rowJson: any[] = {tds: []};
      for (let i = 0; i < sumCols; i++) {
        rowJson.tds.push({
          colspan: 1,
          rowspan: 1,
          list: [],
        });
      }
      rightMenuSelectValue.trs.splice(trIndex.value + 1, 0, rowJson);
    }

const handleShowRightMenu = (e, val, trIndex, tdIndex) => {
  // 显示右键菜单
  e.stopPropagation();
  // this.fileItem = item
  // 显示
  showRightMenu.value = true;

  // 定位
  menuTop.value = e.clientY;
  menuLeft.value = e.clientX;
  // this.rightMenuType = type
  // this.rightId = id
  activeArr.value = [val];
  rightMenuSelectValue = val;
  trIndex.value = trIndex;
  tdIndex.value = tdIndex;
  return false;
}

const handleRemoveRightMenu = () => {
  // 取消右键菜单
  showRightMenu.value = false;
}


onMounted(() => {
  document.addEventListener("click", handleRemoveRightMenu, true);
  document.addEventListener(
      "contextmenu",
      handleRemoveRightMenu,
      true
  );
})
onUnmounted(() => {
  // 移除监听
  document.removeEventListener("click", handleRemoveRightMenu, true);
  document.removeEventListener(
      "contextmenu",
      handleRemoveRightMenu,
      true
  );
})
</script>
