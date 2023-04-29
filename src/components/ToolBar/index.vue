<template>
    <div class="toolbar">
        <!-- 操作栏 -->
        <div class="toolbar-operator">
            <slot name="toolBtn"></slot>
        </div>
        <!-- 搜索表单 -->
        <div class="toolbar-search" v-if="$slots.toolForm">
            <el-form class="search-form">
                <slot name="toolForm"></slot>
            </el-form>
            <div class="search-operator">
                <el-button type="primary" @click="() => { $emit('search') }">查询</el-button>
                <el-button @click="() => { $emit('reset') }">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineOptions} from "unplugin-vue-define-options/macros";

defineOptions({
  name: 'ToolBar'
})

</script>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin: 0 5px;

    .toolbar-operator {
        margin: 8px 0;
    }

    .toolbar-search {
        margin: 8px 0;
        display: flex;
        justify-content: end;
        .search-form {
            display: flex;
            flex-wrap: wrap;
            justify-content: start;
            align-items: center;
            gap: 10px;
            margin: 0 10px;

            // grid-template-columns: repeat(auto-fill, 150px);
            // grid-auto-flow: row;
            // display: inline-grid;
            // grid-gap: 10px;
        }


        .search-operator {
            display: flex;
            flex-wrap: nowrap;
        }

        :deep(.el-form-item) {
            margin: 0;
        }
    }

}


.btn {
    margin-top: 10px;
    margin-left: 30px;
}
</style>