/**
 * @Description: 组件Table数据管理Hook
 */

import {ref, reactive, unref} from 'vue'
import {PaginationProps} from '@/components/Table/types/pagination'
import request from '@/utils/axios'
// @ts-ignore
import {getTree} from "@/utils/common";

interface loadSourceOptions {
    url?: string,
    queryParams?: any,
    pageNo?: number,
    pageSize?: number,
    customRowField?: string,
    isSetUrl?: boolean,
}

export function useTable() {
    const pagination = reactive<PaginationProps & any>({
        pageNo: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 1,
    })
    const tableUrl = ref('');
    const tableParams = ref();
    const tableBaseParams = ref();
    const sourceData = ref<any[]>();
    const tableData = ref<any[]>();

    const setLoadUrl = (url: string) => {
        tableUrl.value = url;
    }

    const useLoadUrl = () => {
        return tableUrl.value;
    }

    const setLoadParams = (params: Object) => {
        tableParams.value = params;
    }

    const useLoadParams = (): Object => {
        return tableParams.value;
    }

    const setBaseParams = (params: Object) => {
        tableBaseParams.value = params;
    }

    const useBaseParams = (): Object => {
        return tableBaseParams.value;
    }

    const setPagination = (pageNo, pageSize, options = {}) => {
        if (pageNo) {
            pagination.pageNo = pageNo
        }
        if (pageSize) {
            pagination.pageSize = pageSize
        }
        Object.keys(options).forEach(key => {
            pagination[key] = options[key];
        })
    }

    const loadSourceData = (options: loadSourceOptions = {}) => {
        const {url, queryParams, pageNo, pageSize, customRowField, isSetUrl = true} = options;
        setPagination(pageNo, pageSize);
        if (url && isSetUrl) tableUrl.value = url;
        const reqUrl = tableUrl.value;
        const option = {
            pageNo: pagination.pageNo,
            pageSize: pagination.pageSize,
            ...tableBaseParams.value
        };
        const params = Object.assign({}, option, queryParams || tableParams.value);

        const promise = new Promise((resolve, reject) => {
            request.post<any>({url: reqUrl, data: params}).then(res => {
                const rowField = customRowField || 'rows'
                sourceData.value = res.data[rowField] || res.data || [];
                const {totalCount, totalPage, pageNo, pageSize} = res.data;
                pagination.totalCount = totalCount;
                pagination.totalPage = totalPage;
                pagination.pageNo = pageNo;
                pagination.pageSize = pageSize;
                resolve(sourceData.value);
            }).catch((err) => {
                reject(err);
            });
        })

        return promise;
    }

    function getData(url, params, method='post') {
        tableUrl.value = url
        if(method==='post'){
            request.post<any>({url: url, data: params}).then(res => {
                tableData.value = res.data.rows
                const {totalCount, totalPage, pageNo, pageSize} = res.data
                pagination.totalCount = totalCount
                pagination.totalPage = totalPage
                pagination.pageNo = pageNo
                pagination.pageSize = pageSize
            })
        }
        if(method==='get'){
            request.get<any>({url: url, params: params}).then(res => {
                tableData.value = res.result.records
                const {totalCount, totalPage, pageNo, pageSize} = res.result
                pagination.totalCount = totalCount
                pagination.totalPage = totalPage
                pagination.pageNo = pageNo
                pagination.pageSize = pageSize
            })
        }
    }

    function changeData(params) {
        getData(tableUrl, params)
    }

    function getTreeData(url, data) {
        request.post<any>({url: url, data: data}).then(res => {
            tableData.value = getTree(res.data);
        })
    }

    function getTreeDataLazy(url, params) {
        tableData.value=[]
        const arr: any[] = []
        request.post<any>({url: url, data: params}).then(res => {
            tableData.value = res.data
            tableData.value?.forEach(item => {
                arr.push({
                    ...item,
                    children: item.state === "closed" ? [] : "",
                    hasChildren: item.state === "closed"
                    // children: item.hasChildren === true ? [] : ""
                })
            })
            tableData.value = arr
        })
    }

    function getChildrenDataLazy(url, row, resolve) {
        request.post<any>({url: url, data: {pid: row.id}}).then(res => {
            const children = res.data
            children.forEach(item => {
                item.children = item.state === "closed" ? [] : ""
                item.hasChildren = item.state === "closed"
            })
            resolve(children)
        })
    }

    return {
        tableData,
        pagination,
        getData,
        changeData,
        getTreeData,
        getTreeDataLazy,
        getChildrenDataLazy,

        sourceData,
        setLoadUrl,
        useLoadUrl,
        setPagination,
        setLoadParams,
        useLoadParams,
        loadSourceData,
        setBaseParams,
        useBaseParams
    }
}