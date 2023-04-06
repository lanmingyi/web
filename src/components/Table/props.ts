import defaultProps from "element-plus/es/components/table/src/table/defaults";
import {
    PaginationProps,
    LoadingConfig,
    TableColumns,
    Align,
} from "./types/index";
import type { PropType } from 'vue';

export default {
    /** Unique key, if there are multiple table instances on a single page, but you only get one table instance, you can solve it by setting the key, but in most cases you don’t need to set it, it will be processed automatically */
    key: {
        type: String || Number,
        default: "0"
    },
    /** Table columns config */
    columns: {
        type: Array as PropType<TableColumns[]>,
        default: []
    },
    /** Table loading */
    loading: {
        type: Boolean,
        default: false
    },
    /** Table loading config */
    loadingConfig: {
        type: Object ,
        default: () => { }
    },
    /** Integrate Table-column with align property into Table property */
    alignWhole: {
        type: String as PropType<Align>,
        default: "left"
    },
    /** Integrate Table-column with header-align property into Table property */
    headerAlign: {
        type: String as PropType<Align>,
        default: ""
    },
    /** Integrate Table-column with show-overflow-tooltip property into Table property */
    showOverflowTooltip: {
        type: Boolean,
        default: true
    },
    /** The background color of the row when the mouse is over the row */
    rowHoverBgColor: {
        type: String,
        default: ""
    },
    /** Pagination config */
    pagination: {
        type: Object as PropType<PaginationProps>,
        default: {
            pageSize: 20,
            totalCount: 0,
            totalPage: 1,
            pageSizes: [20, 40, 50, 100],
            align: "right",
            background: false,
            layout: "sizes, prev, pager, next" 
        }
    },
    /** Pagination size */
    paginationSmall: {
        type: Boolean,
        default: false
    },

    autoPagination: {
        type: Boolean,
        default: true
    },

    autoHeight: {
        type: Boolean,
        default: false
    },
    selection:{
        type: Boolean,
        default: false
    },

    ...defaultProps
};
