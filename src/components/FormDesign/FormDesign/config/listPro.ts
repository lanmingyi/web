/*
 表单列表基础配置
 */
export const listPro = {
    showPage: true, //是否分页
    showPageSize: 10, //分页条数
    showTopButton: true, //显示表格顶部按钮
    showLineButton: false, //显示表格行内按钮
    topButtonList: [{ //顶部按钮
        label: '新增',
        name: '新增',
        checked: true,
        disabled: false,
    }, {
        label: '编辑',
        name: '编辑',
        checked: true,
        disabled: false,
    }, {
        label: '详情',
        name: '详情',
        checked: true,
        disabled: false,
    }, {
        label: '删除',
        name: '删除',
        checked: true,
        disabled: false,
    }],
    lineButtonList: [{ //行内按钮
        label: '编辑',
        name: '编辑',
        checked: true,
        disabled: false,
    }, {
        label: '删除',
        name: '删除',
        checked: true,
        disabled: false,
    }]
}