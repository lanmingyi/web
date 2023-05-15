import {type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory} from "vue-router";

/**
 * 导航守卫
 * 正如其名，vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。
 *
 * 1.全局前置守卫
 * 你可以使用 router.beforeEach 注册一个全局前置守卫
 * 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
 *
 * 2.全局解析守卫
 * 你可以用 router.beforeResolve 注册一个全局守卫。这和 router.beforeEach 类似，因为它在每次导航时都会触发，不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。
 *
 * 3.全局后置钩子
 * 你也可以注册全局后置钩子 router.afterEach，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
 * 它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。
 *
 * 4.路由独享的守卫
 * 你可以直接在路由配置上定义 beforeEnter 守卫
 *
 * 5.组件内的守卫
 * 最后，你可以在路由组件内直接定义路由导航守卫(传递给路由配置的)
 * 可用的配置 API，你可以为路由组件添加以下配置：
 * beforeRouteEnter
 * beforeRouteUpdate
 * beforeRouteLeave
 *
 *
 * 完整的导航解析流程
 * 导航被触发。
 * 在失活的组件里调用 beforeRouteLeave 守卫。
 * 调用全局的 beforeEach 守卫。
 * 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
 * 在路由配置里调用 beforeEnter。
 * 解析异步路由组件。
 * 在被激活的组件里调用 beforeRouteEnter。
 * 调用全局的 beforeResolve 守卫(2.5+)。
 * 导航被确认。
 * 调用全局的 afterEach 钩子。
 * 触发 DOM 更新。
 * 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
 *
 * */
const  Layout = () => import('@/layout/index.vue')
export const constantRoutes: RouteRecordRaw[]=[
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/system/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/system/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/system/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/system/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children:[
  //     {
  //       path: '',
  //       component: ()=>import('@/views/dashboard/Analysis.vue'),
  //       name: 'Dashboard',
  //       meta: {
  //         title: '首页',
  //         svgIcon: 'dashboard',
  //         affix: true
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: "/menu",
  //   component: Layout,
  //   redirect: "/menu/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/system/menu/index.vue"),
  //       name: "menu",
  //       meta: {
  //         title: "菜单",
  //         svgIcon: "dashboard"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/unocss",
  //   component: Layout,
  //   redirect: "/unocss/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/unocss/index.vue"),
  //       name: "UnoCSS",
  //       meta: {
  //         title: "unocss",
  //         svgIcon: "unocss"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://github.com/lanmingyi/web",
  //       component: () => {},
  //       name: "Link",
  //       meta: {
  //         title: "外链",
  //         svgIcon: "link"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/table",
  //   component: Layout,
  //   redirect: "/table/element-plus",
  //   name: "Table",
  //   meta: {
  //     title: "表格",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "element-plus",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus",
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: "vxe-table",
  //       component: () => import("@/views/table/vxe-table/index.vue"),
  //       name: "VxeTable",
  //       meta: {
  //         title: "Vxe Table",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/demo",
  //   component: Layout,
  //   redirect: "/demo/use-fetch-select",
  //   name: "HookDemo",
  //   meta: {
  //     title: "hook 示例",
  //     elIcon: "Menu",
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: "use-fetch-select",
  //       component: () => import("@/views/demo/use-fetch-select.vue"),
  //       name: "UseFetchSelect",
  //       meta: {
  //         title: "useFetchSelect"
  //       }
  //     },
  //     {
  //       path: "use-fullscreen-loading",
  //       component: () => import("@/views/demo/use-fullscreen-loading.vue"),
  //       name: "UseFullscreenLoading",
  //       meta: {
  //         title: "useFullscreenLoading"
  //       }
  //     }
  //   ]
  // }
]

// 动态路由，用来放置有权限 (Roles 属性) 的路由，必须带有name属性
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/system/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/system/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history: import.meta.env.VITE_ROUTER_HISTORY === 'hash'
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

// 重置路由
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}


export default router