/**
 * 存储流程设计相关参数
 */
import {ref} from 'vue'
export default function BpmData() {
  const controls =ref<any[]>([])  // 设计器控件

  const init = () => {
    controls.value = [
      {
        action: 'create.hand-tool',
        title: '拖拽'
      },
      {
        action: 'create.lasso-tool',
        title: '激活套索工具'
      },
      {
        action: 'create.start-event',
        title: '开始'
      },
      {
        action: 'create.intermediate-event',
        title: '中间'
      },
      {
        action: 'create.end-event',
        title: '结束'
      },
      {
        action: 'create.exclusive-gateway',
        title: '网关'
      },
      {
        action: 'create.task',
        title: '任务'
      },
      {
        action: 'create.user-task',
        title: '用户任务'
      },
      {
        action: 'create.call-activity',
        title: '调用活动'
      },
      {
        action: 'create.subprocess-expanded',
        title: '子流程'
      },
      {
        action: 'create.data-object',
        title: '数据对象'
      },
      {
        action: 'create.data-store',
        title: '数据存储'
      },{
        action: 'create.participant-expanded',
        title: '扩展流程'
      },
      {
        action: 'create.group',
        title: '分组'
      }
    ]
  }

  //  获取控件配置信息
  function getControl (action) {
    const result = controls.value.filter(item => item.action === action)
    return result[0] || {}
  }
}