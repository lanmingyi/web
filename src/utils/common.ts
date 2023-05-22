interface ListItem {
    id?: number;
    pid?: number;
    children?: ListItem[];
    hasChildren?: boolean;
    label?: string;
    text?: string;
    uuid?: string
    levelId?: number
    // 其他属性...
}
interface AppendField {
    fieldName: string;
    labelName: string;
    icon?: string;
}

interface CustomField {
    fieldName: string;
    valueName?: string;
    value?: any;
}

interface Options {
    appendFields?: AppendField[];
    customFields?: CustomField[];
}

export function isUrl(url) {
    return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
}

export function getTree(list: ListItem[], options: Options = {}): ListItem[] {
    const map: Map<string, ListItem> = new Map();
    const appendCountMap: Map<string, number> = new Map();
    const roots: ListItem[] = [];
    const { appendFields, customFields } = options;

    for (const item of list) {
        // item.hasChildren = true;
        item.label = item.label || item.text || '';
        const id = item.id!.toString() || item.uuid || '';
        const itemRecord = map.get(id);
        item.children = itemRecord ? itemRecord.children : []
        appendCountMap.set(id, 0);

        //appendFields处理方法，注意混合数据合法性
        if (appendFields && appendFields.length >= 0) {
            let count = appendCountMap.get(id) as number;
            appendFields.forEach(field => {
                const { fieldName, icon, labelName } = field;
                const appendData = item[fieldName];
                appendData.forEach(data => {
                    item.children!.push({
                        ...data,
                        hasChildren: false,
                        id: data.uuid || data.id,
                        label: labelName ? data[labelName] : data.label || data.text,
                        icon
                    });
                });
                count = count + 1;
            })
            appendCountMap.set(id, count)
        }

        //customFields处理方法
        if (customFields && customFields.length >= 0) {
            customFields.forEach(field => {
                const { fieldName, valueName, value = null } = field;
                if (!fieldName) return
                const val = valueName ? item[valueName] || value : value
                item[fieldName] = val
            })
        }

        map.set(id, item);

        const pid = item.pid?.toString() as string;
        if (item.pid?.toString() !== "1" && item.pid?.toString() !== "23DB879B877C3C44E055000000000001" && item.levelId?.toString() !== "1") {
            const parent = map.get(pid) || map.set(pid, { children: [] }).get(pid);
            const count = appendCountMap.get(pid);
            if (count) {
                parent!.children!.splice(-1 * (count as number - 1), 0, item);
            } else {
                parent!.children!.push(item)
            }
        } else {
            roots.push(item);
        }
    }
    return roots;
}
