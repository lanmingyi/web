export interface ListItem {
    avatar?: string
    title: string
    datetime?: string
    description?: string
    status?: "" | "success" | "info" | "warning" | "danger"
    extra?: string
}

export const notifyData: ListItem[] = [
    {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title: "web 上线啦",
        datetime: "半年前",
        description:
            "一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术"
    },
    {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title: "web 上线啦",
        datetime: "一年前",
        description: "一个中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus 和 Pinia"
    }
]

export const messageData: ListItem[] = [
    {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "Nelson Mandela",
        description: "Education is the most powerful weapon which you can use to change the World.",
        datetime: "2023-04-29"
    },
    {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "纳尔逊·曼德拉",
        description: "教育是你可以用来改变世界的最有力的武器",
        datetime: "2023-04-29"
    },
]

export const todoData: ListItem[] = [
    {
        title: "任务名称",
        description: "这家伙很懒，什么都没留下",
        extra: "未开始",
        status: "info"
    },
    {
        title: "任务名称",
        description: "这家伙很懒，什么都没留下",
        extra: "进行中",
        status: ""
    },
    {
        title: "任务名称",
        description: "这家伙很懒，什么都没留下",
        extra: "已超时",
        status: "danger"
    }
]
