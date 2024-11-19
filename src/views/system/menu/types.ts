export interface MenuData {
    // uuid?: string,
    id?: string | null,
    parentId?: string | null,
    name?: string,
    url?: string,
    component?: string | null,
    menuType?: number
    sortNo?: number | null,
    keepAlive?: boolean | null
    children?: null,
    icon?: string | null,
    hidden?: number,
    route?: number,
    creatBy?: string | null,
    createTime?: string | null,
    // creatorId?: string | null,
    // creatorOrgId?: number | null,
    updateBy?: string | null,
    updateTime?: string | null,
}