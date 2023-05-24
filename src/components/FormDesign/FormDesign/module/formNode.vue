<!--
 * @Description: 将数据通过form-item组件解析，生成控件
 -->

<template>
	<div
		class="drag-move-box"
		@click.stop="$emit('handleSelectItem', record)"
		:class="{
			active: record.model && record.key === selectItem.key,
			'form-check-has-model-bg': !record.model,
			'form-check-has-model-active':
				!record.model && record.key === selectItem.key,
		}"
	>
		<div class="form-item-box">
			<kFormItem :formConfig="config" :record="record" />
		</div>
		<!-- <div v-if="!hideModel" class="show-key-box" v-text="record.model" /> -->
		<div
            v-if="!isMult"
			class="copy"
			:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			@click.stop="$emit('handleCopy')"
		>
			<a-icon type="copy" />
		</div>

        <div v-if="record.options.sortValue"
            class="sort"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
        >
            排序顺位：{{record.options.sortValue}}
        </div>
		<a-popconfirm
			placement="bottomRight"
			ok-text="是"
			cancel-text="否"
			@confirm="$emit('handleDelete')"
		>
			<a-icon slot="icon" type="question-circle-o" style="color: red" />
			<template slot="title">
				<p>是否删除该组件？</p>
			</template>
			<div
				class="delete"
				:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			>
				<a-icon type="delete" />
			</div>
		</a-popconfirm>
		<!-- 		<div
			class="delete"
			:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			@click.stop="$emit('handleDelete')"
		>
			<a-icon type="delete" />
		</div> -->
	</div>
</template>
<script>
/*
 * description 通过json生成的单个表单节点
 */
import kFormItem from "../../FormItem/index";
export default {
	props: {
		record: {
			type: Object,
			required: true,
		},
		selectItem: {
			type: Object,
			default: () => {},
		},
		config: {
			type: Object,
			required: true,
		},
		hideModel: {
			type: Boolean,
			default: false,
		},
        isMult: {
			type: Boolean,
			default: false,
        }
	},
	components: {
		kFormItem,
	},
};
</script>

<style lang="less">
.form-check-has-model-bg {
	background: #fcdcdc;

	.ant-form-item-label > label {
		color: #f31c1c;
	}
}

.form-check-has-model-active-bg,
.form-check-has-model-bg:hover {
	background: #fc8b8b !important;

	.ant-form-item-label > label {
		color: #fcfcfc;
	}
}

.form-check-has-model-active {
	background: #fc8b8b;
	border: 1px solid #f31c1c!important;

	.ant-form-item-label > label {
		color: #fcfcfc;
	}
}
</style>


<style lang="scss" scoped>
    .sort {
        position: absolute;
        top: -12px;
        height: 24px;
        text-align: center;
        z-index: 999;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 80px;
        color: #1890ff;
        border: 1px solid #1890ff;
        background: #fff;
        padding: 0 12px;

        &.unactivated {
            opacity: 0 !important;
        }

        &.active {
            opacity: 1 !important;
        }
    }
</style>