import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const rules = reactive(<FormRules>{
    menuType: [
        {
            required: true,
            message: '请选择资源类型',
            trigger: 'blur'
        }
    ],
    name: [
        {
            required: true,
            message: '请输入资源名称',
            trigger: 'blur'
        }
    ],
    url: [
        {
            required: true,
            message: '请输入菜单路径',
            trigger: 'blur'
        }
    ],
    component: [
        {
            required: true,
            message: '请输入前端组件路径',
            trigger: 'blur'
        }
    ],
    sortNo: [
        {
            required: true,
            message: '请输入排序序号',
            trigger: 'blur'
        }
    ],
});