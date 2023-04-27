<template>
  <div class="bpmn-panel">
    <el-tabs v-model="current">
      <el-tab-pane label="节点属性" name="1">
        <node-property-panel
            :form-data="formData"
            :node-element="nodeElement"
            :modeler="modeler"
            @modifyConfigTab="modifyConfigTab"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
        ></node-property-panel>
      </el-tab-pane>
      <el-tab-pane label="表单配置" name="2">
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
import {ref, reactive, onMounted, watch} from 'vue'
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

const {modeler, process} = props
const current = ref('1')
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
})
const nodeElement = ref({})
const formFieldLists = ref([])
const updateList = ref([])
const processData = reactive({
  description: '',
  name: '',
  id: '',
})
const element = ref({})
const isProcess = ref(false)
const authData = reactive({
  authType: '',
  candidateStarterGroups: '',
  candidateStarterGroupsName: '',
  candidateStarterUsers: '',
  candidateStarterUsersName: '',
})
// const formBtnList = ref([])
// const formFieldArray = ref([])
let formBtnList: any[] = []
let formFieldArray: any[] = []
let notificationList: any[] = []

const modifyConfigTab = (element) => {
  configTab.value = 'node'
  if (!element) configTab.value = 'process'
}
const isImplicitRoot = (element) => {
  return element.id === '__implicitroot'
}

const handleModeler = () => {
  modeler.value.on("shape.added", (e) => {
    let element = e.element
    if (isImplicitRoot(element)) return
    element.value = element
    // 初始化设置表单，按钮配置
    let businessObjectLoad = element.businessObject
    if (element.value.type === "bpmn:Process") {
      isProcess.value = true
      current.value = '3'
      authData.authType = businessObjectLoad.authType ? businessObjectLoad.authType : "all"
      authData.candidateStarterGroups = businessObjectLoad.candidateStarterGroups
      authData.candidateStarterGroupsName = businessObjectLoad.candidateStarterGroupsName
      authData.candidateStarterUsers = businessObjectLoad.candidateStarterUsers
      authData.candidateStarterUsersName = businessObjectLoad.candidateStarterUsersName
      processData.description = businessObjectLoad.documentation ? businessObjectLoad.documentation[0].text : "";
      processData.name = businessObjectLoad.name;
      processData.id = businessObjectLoad.id;
    }
    if (element.value.type === "bpmn:UserTask") {
      /* 按钮 */
      if (businessObjectLoad.btnGroup) {
        let btnGroup = businessObjectLoad.btnGroup ? JSON.parse(businessObjectLoad.btnGroup) : [];
        let formBtnList1 = formBtnList.filter((obj) => obj.id != businessObjectLoad.id);
        btnGroup.forEach((e) => {
          e.id = businessObjectLoad.id
          e.modalKey = process.key
          formBtnList1.push(e)
        });
        formBtnList = formBtnList1
      }
      if (businessObjectLoad.formFieldList) {
        /* 表单字段 */
        let formFieldArrays = businessObjectLoad.formFieldList ? JSON.parse(businessObjectLoad.formFieldList) : [];
        let formFieldArray1 = formFieldArray.filter((obj) => obj.id != businessObjectLoad.id);
        formFieldArrays.forEach((e) => {
          e.id = businessObjectLoad.id
          e.modalKey = process.key
          formFieldArray1.push(e)
        });
        formFieldArray = formFieldArray1
      }
      if (businessObjectLoad.notification) {
        /* 通知 */
        let notificationLists = businessObjectLoad.notification && businessObjectLoad.notification.length != 0 ? businessObjectLoad.notification.split(",") : [];
        let notificationList1 = notificationList.filter((obj) => obj.nodeId != businessObjectLoad.id);
        notificationLists.forEach((e) => {
          notificationList1.push({
            noticeName: e,
            nodeId: businessObjectLoad.id,
            actDeModelKey: process.key,
          });
        });
        notificationList = notificationList1;
      }
    }
  })
  modeler.value.on("commandStack.changed", (e) => {
    modeler.saveXML({format: true,}, function (err, xml) {
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
    const {element} = e;
    let _businessObject = element.businessObject;

    if (element.type == modeler.value._definitions.rootElements[0].$type) {
      modifyConfigTab(0);
      // 流程属性
      if (element.value.type == "bpmn:Process") {
        isProcess.value = true;
        element.value = element;
        current.value = "3";
        /* 权限 */
        authData.authType = _businessObject.authType ? _businessObject.authType : "all"
        authData.candidateStarterGroups = _businessObject.candidateStarterGroups
        authData.candidateStarterGroupsName = _businessObject.candidateStarterGroupsName
        authData.candidateStarterUsers = _businessObject.candidateStarterUsers
        authData.candidateStarterUsersName = _businessObject.candidateStarterUsersName
        processData.description = _businessObject.documentation ? _businessObject.documentation[0].text : "";
        processData.name = _businessObject.name;
        processData.id = _businessObject.id;
      }
    } else {
      current.value = "1";
      isProcess.value = false;
      modifyConfigTab(1);
      if (element.value.type == "bpmn:UserTask") {
        formFieldLists.value.forEach((e) => {
          e.isEdit = false;
          e.isView = false;
        });
        if (_businessObject.useType === "assignee") {
          /* 节点处理人 */
          formData.useType = "assignee";
          formData.assignee = _businessObject.assignee;
          formData.assigneeName = _businessObject.assigneeName;
        } else if (_businessObject.userType === "candidateUsers") {
          formData.useType = "candidateUsers";
          formData.candidateUsers = _businessObject.candidateUsers;
          formData.candidateUsersName = _businessObject.candidateUsersName;
        } else if (_businessObject.userType === "processInitiator") {
          formData.useType = "processInitiator";
          formData.processInitiator = _businessObject.processInitiator;
        } else if (_businessObject.userType === "candidateGroups" || _businessObject.userType === "department") {
          formData.useType = _businessObject.userType === "candidateGroups" ? "candidateGroups" : "department";
          formData.candidateGroups = _businessObject.candidateGroups;
          formData.candidateGroupsName = _businessObject.candidateGroupsName;
        }
      }
    }
    if (element.type == "bpmn:SequenceFlow") {
      let _businessObject = element.businessObject;
      // formData.sequenceFlow = _businessObject.conditionExpression ? _businessObject.conditionExpression.body : '${outcome == '同意'}'
    }
    handleFormData(element, "el");
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
  formData.key = process.key
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

  let
      eventDefinitions = businessObject.get("eventDefinitions");
  if (eventDefinitions) {
    /* 定时器 */
    eventDefinitions.forEach((item) => {
      if (item.$type === "bpmn:TimerEventDefinition") {
        if (item["timeDate"]) this.formData.timer = "timeDate";
        if (item["timeDuration"])
          this.formData.timer = "timeDuration";
        if (item["timeCycle"])
          this.formData.timer = "timeCycle";
        if (item[this.formData.timer])
          this.formData.timerValue =
              item[this.formData.timer].body;
      }
    });
  }
  this.nodeElement = element;
  if (type === "el" && businessObject.$type === "bpmn:UserTask") {
    /* 按钮 */
    if (businessObject.btnGroup) {
      let btnGroup = JSON.parse(businessObject.btnGroup);
      let formBtnList = this.formBtnList.filter(
          (obj) => obj.id != businessObject.id
      );
      btnGroup.forEach((e) => {
        (e.id = this.formData.id),
            (e.modalKey = this.formData.key);
        formBtnList.push(e);
      });
      this.formBtnList = formBtnList;
    }
    if (businessObject.formFieldList) {
      /* 表单字段 */
      let formFieldArray = JSON.parse(
          businessObject.formFieldList
      );
      let formFieldArray1 = this.formFieldArray.filter(
          (obj) => obj.id != businessObject.id
      );
      formFieldArray.forEach((e) => {
        (e.id = this.formData.id),
            (e.modalKey = this.formData.key);
        formFieldArray1.push(e);
      });
      this.formFieldArray = formFieldArray1;
    }
    if (businessObject.notification) {
      /* 通知 */
      let notificationList =
          businessObject.notification &&
          businessObject.notification.length != 0
              ? businessObject.notification.split(",")
              : [];
      let notificationList1 = this.notificationList.filter(
          (obj) => obj.nodeId != businessObject.id
      );
      notificationList.forEach((e) => {
        notificationList1.push({
          noticeName: e,
          nodeId: this.formData.id,
          actDeModelKey: this.formData.key,
        });
      });
      this.notificationList = notificationList1;
    }
  }
}

watch(
    () => props.process,
    val => {
      processData = val
    }
)
onMounted(() => {
  handleModeler()
})

</script>

<style scoped>

</style>