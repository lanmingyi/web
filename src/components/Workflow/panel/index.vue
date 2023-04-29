<template>
  <div class="bpmn-panel">
    <el-tabs v-model="activeName">
      <el-tab-pane label="节点属性" name="first">
        <node-property-panel
            :form-data="formData"
            :node-element="nodeElement"
            :modeler="modeler"
            @modifyConfigTab="modifyConfigTab"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
        ></node-property-panel>
      </el-tab-pane>
      <el-tab-pane label="表单配置" name="second">
        <form-panel
            ref="formPanels"
            :node-element="nodeElement"
            :modeler="modeler"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
        ></form-panel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, watch, toRefs} from 'vue'
import NodePropertyPanel from "@/components/Workflow/panel/NodePropertyPanel.vue";
import FormPanel from "@/components/Workflow/panel/FormPanel.vue";

const props = defineProps({
  modeler: {
    type: Object,
    required: true
  },
  process: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
  }
})

const emit = defineEmits(['updateXml',])

const {modeler, process} = toRefs(props)
const activeName = ref("first")
const element = ref()
const formBtnList = ref<any[]>([])
const formFieldArray = ref<any>([])
const formFieldLists = ref<any[]>([])
const notificationList = ref<any>([])
const isProcess = ref(false)
const current = ref('1')
const updateList = ref<any[]>([])
const configTab = ref('node')
const formPanels = ref()
const formData = reactive({
  type: '',
  id: '',
  key: '',
  name: '',
  userType: '',
  useType: '',
  assignee: '',
  assigneeName: '',
  candidateUsers: '',
  candidateUsersName: '',
  processInitiator: '',
  candidateGroups: '',
  candidateGroupsName: '',
  btnGroup: '',
  sequenceFlow: '',
  formFieldArray: '',
  async: '',
  isForCompensation: '',
  dueDate: '',
  priority: '',
  ruleVariablesInput: '',
  rules: '',
  resultVariable: '',
  exclude: '',
  autoStoreVariables: '',
  triggerable: '',
  notification: '',
  skipExpression: '',
  signalRefList: '',
  messageRefList: '',
  conditionalExpression: '',
  conditionalExpressionType: '',
  conditionalScript: '',
  conditionalScriptType: '',
  conditionType: '',
  timer: '',
  timerValue: ''
})
const nodeElement = ref({})
const processData = reactive({
  description: '',
  name: '',
  id: '',
})

const authData = reactive({
  authType: '',
  candidateStarterGroups: '',
  candidateStarterGroupsName: '',
  candidateStarterUsers: '',
  candidateStarterUsersName: '',
})


// 设置按钮表单配置数据
const getFormList = (e) => {
  formFieldLists.value = e;
  isProcess.value = false;
  // this.formBtnList = [];
  notificationList.value = [];
  current.value = "1";
  // this.permissionType = this.permissionType ? this.permissionType : "all";
}
// 获取表单更新数据
const updateFormLists = (e) => {
  updateList.value = e;
}

const modifyConfigTab = (element) => {
  configTab.value = 'node'
  if (!element) configTab.value = 'process'
}
const isImplicitRoot = (element) => {
  return element.id === '__implicitroot'
}

const handleModeler = () => {
  modeler.value.on("shape.added", (e) => {
    const addElement = e.element
    if (isImplicitRoot(addElement)) return
    // 初始化设置表单，按钮配置
    const addBusinessObject = e.element.businessObject
    if (addElement.type === "bpmn:Process") {
      isProcess.value = true
      activeName.value = 'third'
      authData.authType = addBusinessObject.authType ? addBusinessObject.authType : "all"
      authData.candidateStarterGroups = addBusinessObject.candidateStarterGroups
      authData.candidateStarterGroupsName = addBusinessObject.candidateStarterGroupsName
      authData.candidateStarterUsers = addBusinessObject.candidateStarterUsers
      authData.candidateStarterUsersName = addBusinessObject.candidateStarterUsersName
      processData.description = addBusinessObject.documentation ? addBusinessObject.documentation[0].text : "";
      processData.name = addBusinessObject.name;
      processData.id = addBusinessObject.id;
    }
    if (addElement.type === "bpmn:UserTask") {
      /* 按钮 */
      if (addBusinessObject.btnGroup) {
        let btnGroup = addBusinessObject.btnGroup ? JSON.parse(addBusinessObject.btnGroup) : [];
        let formBtnList1 = formBtnList.value.filter((item) => item.id != addBusinessObject.id);
        btnGroup.forEach((e) => {
          e.id = addBusinessObject.id
          e.modalKey = process.value.key
          formBtnList1.push(e)
        });
        formBtnList.value = formBtnList1
      }
      if (addBusinessObject.formFieldList) {
        /* 表单字段 */
        let formFieldArrays = addBusinessObject.formFieldList ? JSON.parse(addBusinessObject.formFieldList) : [];
        formFieldArray.value.filter((obj) => obj.id != addBusinessObject.id);
        formFieldArrays.forEach((e) => {
          e.id = addBusinessObject.id
          e.modalKey = process.value.key
          formFieldArray.value.push(e)
        });
      }
      if (addBusinessObject.notification) {
        /* 通知 */
        let notificationLists = addBusinessObject.notification && addBusinessObject.notification.length != 0 ? addBusinessObject.notification.split(",") : [];
        notificationList.value.filter((obj) => obj.nodeId != addBusinessObject.id);
        notificationLists.forEach((e) => {
          notificationList.value.push({
            noticeName: e,
            nodeId: addBusinessObject.id,
            actDeModelKey: process.value.key,
          });
        });
      }
    }
  })
  modeler.value.on("commandStack.changed", (e) => {
    modeler.value.saveXML({format: true,}, function (err, xml) {
      emit('updateXml', xml)
    })
  })
  modeler.value.on("selection.changed", (e) => {
    const element = e.newSelection[0]
    if (!element) return
    modifyConfigTab(element)
    handleFormData(element, '')
  })
  modeler.value.on("element.changed", e => {
    const {element} = e
    if (!element) return
    handleFormData(element, 'el')
  })
  // 节点点击
  modeler.value.on("element.click", e => {
    const clickElement = e.element;
    let clickBusinessObject = clickElement.businessObject;
    if (clickElement.type == modeler.value._definitions.rootElements[0].$type) {
      modifyConfigTab(0);
      // 流程属性
      if (clickElement.type == "bpmn:Process") {
        isProcess.value = true;
        element.value = element;
        activeName.value = "third";
        /* 权限 */
        authData.authType = clickBusinessObject.authType ? clickBusinessObject.authType : "all"
        authData.candidateStarterGroups = clickBusinessObject.candidateStarterGroups
        authData.candidateStarterGroupsName = clickBusinessObject.candidateStarterGroupsName
        authData.candidateStarterUsers = clickBusinessObject.candidateStarterUsers
        authData.candidateStarterUsersName = clickBusinessObject.candidateStarterUsersName
        processData.description = clickBusinessObject.documentation ? clickBusinessObject.documentation[0].text : "";
        processData.name = clickBusinessObject.name;
        processData.id = clickBusinessObject.id;
      }
    } else {
      activeName.value = "first";
      isProcess.value = false;
      modifyConfigTab(1);
      if (clickElement.type == "bpmn:UserTask") {
        formFieldLists.value.forEach((e) => {
          e.isEdit = false;
          e.isView = false;
        });
        if (clickBusinessObject.useType === "assignee") {
          /* 节点处理人 */
          formData.useType = "assignee";
          formData.assignee = clickBusinessObject.assignee;
          formData.assigneeName = clickBusinessObject.assigneeName;
        } else if (clickBusinessObject.userType === "candidateUsers") {
          formData.useType = "candidateUsers";
          formData.candidateUsers = clickBusinessObject.candidateUsers;
          formData.candidateUsersName = clickBusinessObject.candidateUsersName;
        } else if (clickBusinessObject.userType === "processInitiator") {
          formData.useType = "processInitiator";
          formData.processInitiator = clickBusinessObject.processInitiator;
        } else if (clickBusinessObject.userType === "candidateGroups" || clickBusinessObject.userType === "department") {
          formData.useType = clickBusinessObject.userType === "candidateGroups" ? "candidateGroups" : "department";
          formData.candidateGroups = clickBusinessObject.candidateGroups;
          formData.candidateGroupsName = clickBusinessObject.candidateGroupsName;
        }
      }
    }
    if (clickElement.type == "bpmn:SequenceFlow") {
      let clickBusinessObject = clickElement.businessObject;
      // formData.sequenceFlow = clickBusinessObject.conditionExpression ? clickBusinessObject.conditionExpression.body : '${outcome == '同意'}'
    }
    handleFormData(clickElement, "el");
  })
}

const handleFormData = (element, type) => {
  if (!element.id) {
    return;
  }
  let businessObject = element.businessObject;

  /* 节点处理人 */
  authData.authType = businessObject.authType ? businessObject.authType : "all"
  authData.candidateStarterGroups = businessObject.candidateStarterGroups
  authData.candidateStarterGroupsName = businessObject.candidateStarterGroupsName
  authData.candidateStarterUsers = businessObject.candidateStarterUsers
  authData.candidateStarterUsersName = businessObject.candidateStarterUsersName

  /* 流程属性 */
  formData.type = element.type
  formData.id = businessObject.id
  formData.key = process.value.key
  formData.name = businessObject.name
  formData.userType = businessObject.userType
  formData.assignee = businessObject.assignee
  formData.assigneeName = businessObject.assigneeName
  formData.candidateUsersName = businessObject.candidateUsersName
  formData.candidateGroups = businessObject.candidateGroups
  formData.candidateGroupsName = businessObject.candidateGroupsName
  formData.candidateUsers = businessObject.candidateUsers
  formData.processInitiator = businessObject.processInitiator
  formData.btnGroup = businessObject.btnGroup
  formData.sequenceFlow = businessObject.conditionExpression ? businessObject.conditionExpression.body : ""
  formData.formFieldArray = businessObject.formFieldList
  formData.async = businessObject.async
  formData.isForCompensation = businessObject.isForCompensation
  formData.dueDate = businessObject.dueDate
  formData.priority = businessObject.priority
  formData.ruleVariablesInput = businessObject.ruleVariablesInput
  formData.rules = businessObject.rules
  formData.resultVariable = businessObject.resultVariable
  formData.exclude = businessObject.exclude
  formData.autoStoreVariables = businessObject.autoStoreVariables
  formData.triggerable = businessObject.triggerable
  formData.notification = businessObject.notification ? businessObject.notification.split(",") : []
  formData.skipExpression = businessObject.skipExpression
  formData.signalRefList = businessObject.$parent?.$attrs.signalRefList ?? []
  formData.messageRefList = businessObject.$parent?.$attrs.messageRefList ?? []
  formData.conditionalExpression = businessObject.$attrs.conditionalExpression
  formData.conditionalExpressionType = businessObject.$attrs.conditionalExpressionType
  formData.conditionalScript = businessObject.$attrs.conditionalScript
  formData.conditionalScriptType = businessObject.$attrs.conditionalScriptType
  formData.conditionType = businessObject.$attrs.conditionType

  let eventDefinitions = businessObject.get("eventDefinitions");
  if (eventDefinitions) {
    /* 定时器 */
    eventDefinitions.forEach((item) => {
      if (item.$type === "bpmn:TimerEventDefinition") {
        if (item["timeDate"]) formData.timer = "timeDate";
        if (item["timeDuration"])
          formData.timer = "timeDuration";
        if (item["timeCycle"])
          formData.timer = "timeCycle";
        if (item[formData.timer])
          formData.timerValue =
              item[formData.timer].body;
      }
    });
  }
  nodeElement.value = element;
  if (type === "el" && businessObject.$type === "bpmn:UserTask") {
    /* 按钮 */
    if (businessObject.btnGroup) {
      let btnGroup = JSON.parse(businessObject.btnGroup);
      formBtnList.value.filter((obj) => obj.id != businessObject.id);
      btnGroup.forEach((e) => {
        e.id = formData.id
        e.modalKey = formData.key
        formBtnList.value.push(e);
      });
      // formBtnList = formBtnList;
    }
    if (businessObject.formFieldList) {
      /* 表单字段 */
      let formFieldArrays = JSON.parse(businessObject.formFieldList);
      formFieldArray.value.filter((obj) => obj.id != businessObject.id);
      formFieldArrays.forEach((e) => {
        e.id = formData.id
        e.modalKey = formData.key
        formFieldArray.value.push(e);
      });
    }
    if (businessObject.notification) {
      /* 通知 */
      let notificationLists =
          businessObject.notification &&
          businessObject.notification.length != 0
              ? businessObject.notification.split(",")
              : [];
      notificationList.value.filter((obj) => obj.nodeId != businessObject.id);
      notificationLists.forEach((e) => {
        notificationList.value.push({
          noticeName: e,
          nodeId: formData.id,
          actDeModelKey: formData.key,
        });
      });
    }
  }
}

watch(
    () => props.process,
    val => {
      processData.id = val.id
      processData.description = val.description
      processData.name = val.name
    },
    // {deep: true, immediate: true}
)
onMounted(() => {
  handleModeler()
})

</script>

<style lang="scss" scoped>
.bpmn-panel {
  width: 350px;
  border: 1px solid #eeeeee;
  padding: 0 5px;
  overflow-y: auto;

  .ant-tabs-nav {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;

    div:not(.ant-tabs-ink-bar) {
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
    }
  }
}

.config-tab {
  height: 43px;
  line-height: 43px;
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}

.config-tab.active {
  border-bottom: solid 2px #409eff;
}
</style>