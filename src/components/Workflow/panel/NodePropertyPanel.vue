<template>
  <div>
    <el-form
        :inline="false" :model="formData"
        v-if="!~['bpmn:CallActivity', 'bpmn:SubProcess'].indexOf(formData.type)"
    >
      <el-form-item label="节点类型">
        <el-input v-model="formData.type" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input v-model="formData.id" :disabled="true" @change="(e) => { updateId(e.target.value) }"></el-input>
      </el-form-item>
      <el-form-item label="节点名称">
        <el-input v-model="formData.name" @change="(e) =>{ updateName(e.target.value) }"></el-input>
      </el-form-item>
      <el-form-item label="节点人员" v-if="formData.type === 'bpmn:UserTask'">
        <el-select v-model="formData.userType" placeholder="请选择" @change="changeUserType">
          <el-option
              v-for="(item, index) in userTypeOptions"
              :key="index"
              :value="item.value"
              :label="item.label"
          ></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="指定人员" v-if="formData.type === 'bpmn:UserTask' && formData.userType==='assignee'">
        <el-input
            key="1"
            v-model="formData.assigneeName"
            placeholder="请选择"
            @change="(e) => {setUser({assignee: formData.assigneeName, assigneeName: formData.assigneeName,})}"
        >
          <el-icon #append @click="() => (isUserSelect.value = true)">
            <User/>
          </el-icon>
        </el-input>
        <!--        <user-select :visible="isUserSelect" @change="(value) => addUser(value, 1)" @close="() => (isUserSelect = false)" ></user-select>-->
      </el-form-item>
      <el-form-item
          label="候选人员"
          v-else-if="formData.type == 'bpmn:UserTask' && formData.userType === 'candidateUsers'"
      >
        <el-input
            key="2"
            v-model="formData.candidateUsersName"
            placeholder="请选择"
            @change="(e) => {setUser({candidateUsers: formData.candidateUsersName, candidateUsersName: formData.candidateUsersName,})}"
        >
          <el-icon #append @click="() => (isUserSelect1.value = true)">
            <User/>
          </el-icon>
        </el-input>
        <!--        <user-select :visible="isUserSelect1" @change="(value) => addUser(value, 1)" @close="() => (isUserSelect1 = false)" ></user-select>-->
      </el-form-item>
      <el-form-item
          label="指定角色"
          v-else-if="formData.type == 'bpmn:UserTask' &&formData.userType === 'candidateGroups'"
      >
        <el-input
            key="3"
            v-model="formData.candidateGroupsName"
            placeholder="请选择"
            @change="(e) =>{setUser({candidateGroups: formData.candidateGroupsName,candidateGroupsName: formData.candidateGroupsName,})}"
        >
          <el-icon #append @click="() => (isUserSelect1.value = true)">
            <User/>
          </el-icon>
        </el-input>
        <!--        <role-select :userList="formData.candidateGroups" :visible="isUserSelect1" style="width: 100%;"-->
        <!--                    :typeNum="2" @change="(value) => addUser(value, 3)" @close="() => (isUserSelect1 = false)"/>-->
      </el-form-item>
      <el-form-item label="流程发起人"
                    v-else-if=" formData.type == 'bpmn:UserTask' && formData.userType === 'processInitiator'">
        <el-input v-model="formData.processInitiator" :default-value="'${startUserNameId}'" disabled></el-input>
      </el-form-item>
      <el-form-item label="岗位" v-else-if="formData.type == 'bpmn:UserTask' && formData.userType === 'department'">
        <el-input key="3" v-model="formData.candidateGroupsName" placeholder="请选择"
                  @change="(e) =>{setUser({candidateGroups: formData.candidateGroupsName,candidateGroupsName: formData.candidateGroupsName,})}">
          <el-icon #append @click="() => (isUserSelect1 = true)">
            <User/>
          </el-icon>
        </el-input>
        <!--        <department :userList="formData.candidateGroups" :visible="isUserSelect1" style="width: 100%;"-->
        <!--                      :typeNum="2" @change="(value) => addUser(value, 4)" @close="() => (isUserSelect1 = false)" />-->
      </el-form-item>
      <!--按钮配置-->
      <template v-if="formData.type === 'bpmn:UserTask'">
        <el-divider>按钮配置</el-divider>
        <div v-for="(item, index) in buttonGroup" :key="index">
          <div class="select-item" v-if="item.nodeButtonCode">
            <div class="select-line-icon option-drag">
              <el-icon>
                <Menu/>
              </el-icon>
            </div>
            <el-input readOnly v-model="item.nodeButtonName" placeholder="选项名"/>
            <el-input readOnly placeholder="选项值" v-model="item.nodeButtonCode" type="hidden"/>
            <div class="close-btn select-line-icon" @click="setButtonGroupItem(index)">
              <el-icon>
                <RemoveFilled/>
              </el-icon>
            </div>
          </div>
        </div>
        <div style="margin-left: 20px;">
          <el-button style="padding-bottom: 0" :icon="CirclePlusFilled" link @click="openButtonSelect()">
            快速添加
          </el-button>
        </div>
        <!--        <button-popup ref="buttonRef" :btnList="buttonGroup" :visible="isButtonSelect" style="width: 100%;"-->
        <!--                      @change="(value) => setButtonGroupItem(value, 'list')" @cancel="() => (isButtonSelect = false)" />-->
        <el-divider></el-divider>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref, toRefs} from 'vue'
import {CirclePlusFilled} from '@element-plus/icons-vue'

defineOptions({
  name: 'NodePropertyPanel'
})

const props = defineProps({
  modeler: {
    type: Object,
    required: true
  },
  nodeElement: {
    type: Object,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  formFieldLists: {
    type: Array
  },
  updateList: {
    type: Array
  }
})
const {modeler, nodeElement, formData} = toRefs(props)

const emit = defineEmits(['modifyFormData', 'setFormBtnData'])

const userTypeOptions = [
  {value: 'assignee', label: '指定人员',},
  {value: 'candidateUsers', label: '候选人员',},
  {value: 'candidateGroups', label: '指定角色',},
  {value: 'processInitiator', label: '流程发起人',},
  {value: 'department', label: '岗位',},
]
const isUserSelect = ref(false)
const isUserSelect1 = ref(false)
const isButtonSelect = ref(false)
const buttonGroup = ref<any>([])
const buttonRef = ref()

const updateProperties = (properties) => {
  modeler.value.get('modeling').updateProperties(nodeElement.value, properties)
}
const updateId = (id) => {
  updateProperties({id: id})
}

const updateName = (name) => {
  updateProperties({name: name})
}

// 节点处理人类型
const changeUserType = (e) => {
  isUserSelect.value = true
  updateProperties({userType: e})
  emit('modifyFormData', {userType: e})
  if (e === 'processInitiator') {
    addUser(e, 0)
  }
}
// 设置节点处理人
const setUser = (properties) => {
  updateProperties(properties);
  Object.assign(properties, {
    userType: Object.keys(properties)[0]
  });
  emit('modifyFormData', properties);
}

// 设置节点处理人
const addUser = (properties, type) => {
  if (nodeElement.value.businessObject?.processInitiator) delete nodeElement.value.businessObject.processInitiator
  if (nodeElement.value.businessObject?.assignee) delete nodeElement.value.businessObject.assignee
  if (nodeElement.value.businessObject?.assigneeName) delete nodeElement.value.businessObject.assigneeName
  if (nodeElement.value.businessObject?.candidateUsers) delete nodeElement.value.businessObject.candidateUsers
  if (nodeElement.value.businessObject?.candidateUsersName) delete nodeElement.value.businessObject.candidateUsersName
  if (nodeElement.value.businessObject?.candidateGroups) delete nodeElement.value.businessObject.candidateGroups
  if (nodeElement.value.businessObject?.candidateGroupsName) delete nodeElement.value.businessObject.candidateGroupsName

  if (properties === 'processInitiator') {
    properties = {
      userType: 'processInitiator',
      processInitiator: '${startUserNameId}',
      assignee: '${startUserNameId}',
    }
  } else {
    let value = {
      1: {
        userType: 'assignee',
        assignee: properties.userNameId,
        assigneeName: properties.userName
      },
      2: {
        userType: 'candidateUsers',
        candidateUsers: properties.userNameId,
        candidateUsersName: properties.userName
      },
      3: {
        userType: 'candidateGroups',
        candidateGroups: properties.uuid,
        candidateGroupsName: properties.userName
      },
      4: {
        userType: 'department',
        candidateGroups: properties.value,
        candidateGroupsName: properties.text
      }
    }
    properties = value[type] ? value[type] : ''
  }
  updateProperties(properties)
  emit('modifyFormData', properties)
}

// 按钮数据处理
const setButtonGroupItem = (index, type) => {
  let businessObject = nodeElement.value.businessObject
  if (type === 'list') {
    buttonGroup.value = []
    index.forEach(e => {
      buttonGroup.value.push({
        nodeButtonCode: e.buttonCode,
        nodeButtonName: e.buttonName,
        id: businessObject.id,
        modalKey: businessObject.$parent.id,
        nodeFormPath: businessObject.formDesignUrl,
        nodeFormEditPath: businessObject.formDesignDetailUrl,
        nodeFormUpdatePath: businessObject.nodeFormUpdatePathUrl,
        nodeFormSavePath: businessObject.nodeFormSavePathUrl,
        whetherUpdate: businessObject.formEditable
      })
    })
  } else if (index >= 0) {
    buttonGroup.value.splice(index, 1)
  } else {
    if (!buttonGroup.value) buttonGroup.value = []
    buttonGroup.value.push({
      nodeButtonCode: '',
      nodeButtonName: '',
      id: businessObject.id,
      modalKey: businessObject.$parent.id,
      nodeFormPath: businessObject.formDesignUrl,
      nodeFormEditPath: businessObject.formDesignDetailUrl,
      nodeFormUpdatePath: businessObject.nodeFormUpdatePathUrl,
      nodeFormSavePath: businessObject.nodeFormSavePathUrl,
      whetherUpdate: businessObject.formEditable
    })
  }
  updateProperties({
    buttonGroup: JSON.stringify(buttonGroup.value)
  });
  emit('setFormBtnData', 'buttonGroup', buttonGroup.value)

}

// 按钮配置
const openButtonSelect = () => {
  isButtonSelect.value = true
  buttonRef.value.getBtnList(buttonGroup.value)

}

</script>

<style scoped>

</style>