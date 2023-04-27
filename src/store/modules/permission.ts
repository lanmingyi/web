import {ref} from "vue"
import store from "@/store"
import {defineStore} from "pinia"
import {type RouteRecordRaw} from "vue-router"
import {asyncRoutes, constantRoutes} from "@/router"
import asyncRouteSettings from "@/config/async-route"

const Layout = () => import('@/layout/index.vue')
const modules = import.meta.glob('@/views/**/*.vue')


const hasPermission = (roles: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.roles) {
        return roles.some((role) => {
            if (route.meta?.roles !== undefined) {
                return route.meta.roles.includes(role)
            } else {
                return false
            }
        })
    } else {
        return true
    }
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach((route) => {
        const r = {...route}
        if (hasPermission(roles, r)) {
            if (r.children) {
                r.children = filterAsyncRoutes(r.children, roles)
            }
            res.push(r)
        }
    })
    return res
}

// 生成首页路由
function generateIndexRouter(data) {
    return [{
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            ...generateChildRouters(data)
        ]
    },];
}

// 生成嵌套路由（子路由）
function generateChildRouters(data) {
    const routers: any[] = [];
    data.map(item => {
        if (item.component === 'Layout') {
            item.component = () => import("@/layout/index.vue")
        } else if (item.component) {
            item.component = modules[`/src/views/${item.component}.vue`]
        }
        // // eslint-disable-next-line
        // let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
        // if (isURL(URL)) {
        //   item.meta.url = URL;
        // }
        let menu: any = {
            path: item.path,
            name: item.name,
            redirect: item.redirect,
            component: item.component,
            hidden: item.hidden,
            meta: {
                title: item.meta.title,
                icon: item.meta.icon,
                url: item.meta.url,
                permissionList: item.meta.permissionList,
                keepAlive: item.meta.keepAlive,
                // 赋值
                internalOrExternal: item.meta.internalOrExternal,
                componentName: item.meta.componentName
            },
            // alwaysShow: undefined,
            // children: [],
        }
        if (item.alwaysShow) {
            menu.alwaysShow = true;
            menu.redirect = menu.path;
        }
        if (item.children && item.children.length > 0) {
            menu.children = [...generateChildRouters(item.children)];
        }
        //-根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）
        //判断是否生成路由
        if (item.route && item.route === '0') {
            //console.log(' 不生成路由 item.route：  '+item.route);
            //console.log(' 不生成路由 item.path：  '+item.path);
        } else {
            routers.push(menu);
        }
    })
    return routers
}


export const usePermissionStore = defineStore("permission", () => {
    const routes = ref<RouteRecordRaw[]>([])
    const dynamicRoutes = ref<RouteRecordRaw[]>([])
    const menu = ref()


    // const setRoutes = (roles: string[]) => {
    const setRoutes = (route: any) => {
        menu.value = route
        let accessedRoutes
        if (!asyncRouteSettings.open) {
            accessedRoutes = asyncRoutes
        } else {
            // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            // accessedRoutes = route
            accessedRoutes = generateIndexRouter(route)
        }
        routes.value = constantRoutes.concat(accessedRoutes)
        dynamicRoutes.value = accessedRoutes
        // console.log('routes.value', routes.value)
        // console.log('dynamicRoutes.value', dynamicRoutes.value)
        // console.log('menu.value', menu.value)
    }
    return {routes, dynamicRoutes, menu, setRoutes}
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
    return usePermissionStore(store)
}
