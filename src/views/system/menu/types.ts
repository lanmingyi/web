export interface MenuData {
    // uuid?: string,
    id?: string | null,
    parentId?: string | null,
    name?: string,
    component?: string,
    url?: string,
    menuType?: number
    sortNo?: number,
    children?: null,
    code?: string | null,
    codeSetId?: string | null,
    createTime?: string | null,
    creator?: string | null,
    creatorId?: string | null,
    creatorOrgId?: number | null,
    icon?: string | null,
    iconClsColour?: string | null,
    keepAlive?: boolean | null
    levelId?: number | null,
    modifier?: string | null,
    modifierId?: string | null,
    modifyTime?: string | null,
    route?: boolean
    status?: number
    textColour?: null

}

export interface MenuDataForm {
    uuid?: string,
    pid?: number | null,
    levelId?: number | null,
    resourceType: string,
    text: string,
    keepAlive: null,
    status: 1,
    state: string,
    iconCls: string,
    url: string,
    remark: string,
    sort: number,
    codeSetId: string,
    iconClsColour: string,
}