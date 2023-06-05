<template>
  <div class="content">
    <!--    节点-->
    <div class="node-class" v-show="nodeShow">
      <div class="title">{{ nodeTitle }}
        <el-icon @click="handleNodeClose">
          <Close/>
        </el-icon>
      </div>
      <div class="operate">
        <!--        搜索-->
        <el-input v-model="searchValue" placeholder="请输入关键词" style="width: 150px; margin-right:10px"
                  @input="handleInputSearch" :suffix-icon="Search" @change="onSearchClick">
        </el-input>
        <el-button class="margin-r5" :icon="RefreshRight" @click="handleReload"/>
        <el-dropdown class="margin-r5" @command="handleCreate">
          <el-button type="primary" :icon="Plus"/>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">创建点</el-dropdown-item>
              <el-dropdown-item command="2">创建区域</el-dropdown-item>
              <el-dropdown-item command="3">创建线路</el-dropdown-item>
              <el-dropdown-item command="4">创建图层</el-dropdown-item>
              <el-dropdown-item command="5" :icon="FolderAdd">创建文件夹</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown class="margin-r5" @command="handleFold">
          <el-button :icon="ArrowDown"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">全部折叠</el-dropdown-item>
              <el-dropdown-item command="2">展开至图层</el-dropdown-item>
              <el-dropdown-item command="3">展开至1级要素</el-dropdown-item>
              <el-dropdown-item command="4">展开至元素</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="margin-r5" :icon="Filter"/>
      </div>

      <el-tabs v-model="nodeTabActiveName" :tab-position="tabPosition" class="node-tab">
        <el-tab-pane label="All" name="1">
          <div class="node-tree">
            <el-tree
                :data="treeData1"
                :props="replaceFields"
                @node-click="handleTreeClick"
                show-checkbox
                @check="handleTreeCheck"
                node-key="uuid"
            >
              <!--              <el-icon type="Folder"/>-->
              <!--              <el-icon type="Location"/>-->
              <!--              <template slot="title" slot-scope="{folderName:title, uuid:key}">-->
              <template #default="{ node, data }">
                <span class="custom-tree-node">
<!--                  <el-icon></el-icon>-->
                  <span v-if="node.label.indexOf(searchValue) > -1"><svg-icon name="folder"/>
                    {{ node.label.substr(0, node.label.indexOf(searchValue)) }}
                    <span style="color: #f50">{{ searchValue }}</span>
                    {{ node.label.substr(node.label.indexOf(searchValue) + searchValue.length) }}
                  </span>
                  <span v-else><svg-icon name="folder"/> {{ node.label }}</span>
                  <el-dropdown class="margin-l10" @command="(e)=>handleNodeItem(e,node.label, node.key)">
                    <el-icon><MoreFilled/></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="1">详情</el-dropdown-item>
                        <el-dropdown-item command="2">编辑</el-dropdown-item>
                        <el-dropdown-item command="3">删除</el-dropdown-item>
                        <el-dropdown-item command="4">复制</el-dropdown-item>
                        <el-dropdown-item command="5">移动</el-dropdown-item>
                        <el-dropdown-item command="6" divided>勾选以下</el-dropdown-item>
                        <el-dropdown-item command="7">取消勾选以下</el-dropdown-item>
                        <el-dropdown-item command="8">新建文件夹</el-dropdown-item>
                        <el-dropdown-item command="9">新建图层</el-dropdown-item>
                        <el-dropdown-item command="10">作为根节点查看</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </span>
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="点" name="2">Config</el-tab-pane>
        <el-tab-pane label="区" name="3">Role</el-tab-pane>
        <el-tab-pane label="线" name="4">Task</el-tab-pane>
        <el-tab-pane label="step" name="5">Task</el-tab-pane>
        <el-tab-pane label="轨迹" name="6">Task</el-tab-pane>
        <el-tab-pane label="tab7" name="7">Task</el-tab-pane>
      </el-tabs>
    </div>

<!--    地图-->
    <div class="map-class" id='map'>

    </div>

    <!--    属性-->
    <div class="property-class" v-show="propertyShow">
      <div class="title">{{ propertyTitle }}
        <el-icon @click="handlePropertyClose"><Close/></el-icon>
      </div>
      <el-tabs v-model="propertyTabActiveKey" :tab-position="tabPosition"
               @edit="handlePropertyTabEdit" closable>
        <el-tab-pane v-for="(pane, index) in propertyPanes" :name="pane.key" :label="pane.tab">
          <div class="property-form">
            <el-collapse v-model="collapseActiveKey" expand-icon-position="right" :bordered="false">
              <el-collapse-item name="1" title="基础信息" :style="customStyle">
                <el-form ref="formRef" :model="pane.formData" :rules="rules">
                  <el-form-item label="名称" prop="folderName">
                    <el-input v-model="pane.formData.folderName"/>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input type="textarea" v-model="pane.formData.remark"/>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item name="2" title="排序" :disabled="false" :style="customStyle">
                <el-form ref="formRef" :model="pane.formData" :label-col="labelCol" :wrapper-col="wrapperCol"
                         :rules="rules">
                  <el-form-item label="排序" prop="sort">
                    <!--                    <a-input v-model="pane.formData.sort"/>-->
                    <el-input-number :min="0" :max="9" v-model="pane.formData.sort"
                                     placeholder="请输入0到9，最多两位小数"/>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item name="3" title="编辑记录" :style="customStyle" v-show="pane.editRecordShow">
                <el-table :columns="recordColumns" :data="pane.editRecord" :pagination="false" rowKey="dataIndex">
                </el-table>
              </el-collapse-item>
            </el-collapse>
            <div class="property-operate">
              <el-button class="margin-r10" @click="remove(pane.key)">取消</el-button>
              <el-button type="primary" @click="handlePropertyOk(pane.key, index)" v-show="pane.propertyOkShow">确定
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted} from 'vue'
import request from "@/utils/axios/index";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  Plus,
  RefreshRight,
  Search,
  ArrowDown,
  Filter,
  FolderAdd,
  Folder,
  Location,
  Close, MoreFilled
} from "@element-plus/icons-vue";
import Map from "ol/Map";
import {Tile as TileLayer} from "ol/layer";
import {XYZ} from "ol/source";
import View from "ol/View";

defineOptions({
  name: 'image-processing'
})

const treeData = ref<any[]>([])
const nodeTabActiveName = ref('1')
const replaceFields = {label: "folderName"}
treeData.value = [
  {
    title: '非危化文件夹（示例）',
    key: '0-0',
    slots: {icon: 'folder'},
    layer: 0,
    type: '',
    hasChildren: true,
    children: [
      {
        title: '山东文件夹',
        key: '0-0-0',
        slots: {icon: 'folder'},
        layer: 1,
        type: '',
        hasChildren: true,
        children: [
          {title: '青岛点位图层', key: '0-0-0-0', disableCheckbox: true, type: 'map', layer: 2, hasChildren: false,},
          {
            title: '烟台点位图层',
            key: '0-0-0-1',
            layer: 2,
            type: 'map',
            hasChildren: true,
            children: [{
              title: 'P4151 万华仓库东门',
              key: '0-0-0-1-0',
              slots: {icon: 'environment'},
              layer: 3,
              type: '',
              hasChildren: false,
            }]
          },
        ],
      },
      {
        title: '江苏文件夹',
        key: '0-0-1',
        slots: {icon: 'folder'},
        disabled: true,
        layer: 1,
        type: '',
        hasChildren: true,
        children: [{title: '点位图层', key: '0-0-1-0', layer: 2, type: 'map', slots: {}, hasChildren: false}],

      },
    ],
  },
];

const treeData1 = [
  {
    "uuid": "BCB5C74B9C86485F8623A8A02A9F204F",
    "creatorId": "ewsd0001",
    "creator": "超级管理员",
    "createTime": "2023-06-03 09:15:26",
    "modifierId": "ewsd0001",
    "modifier": "超级管理员",
    "modifyTime": "2023-06-05 13:04:10",
    "creatorOrgId": 4,
    "pid": "",
    "folderName": "Landsat",
    "sort": 0,
    "remark": "1",
    "levelId": 1,
    "children": [
      {
        "uuid": "F9AF1DA5DF21495DBA1B552FA01E1ABC",
        "creatorId": "ewsd0001",
        "creator": "超级管理员",
        "createTime": "2023-06-03 10:36:55",
        "modifierId": "ewsd0001",
        "modifier": "超级管理员",
        "modifyTime": "2023-06-03 16:52:24",
        "creatorOrgId": 4,
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat5 C2 L2",
        "sort": 2,
        "remark": "1",
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      },
      {
        "uuid": "E57DD42B708E45F39DC1112CEB5BADA8",
        "creatorId": "ewsd0001",
        "creator": "超级管理员",
        "createTime": "2023-06-03 10:37:42",
        "modifierId": "ewsd0001",
        "modifier": "超级管理员",
        "modifyTime": "2023-06-03 16:52:31",
        "creatorOrgId": 4,
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat7 C2 L2",
        "sort": 3,
        "remark": "1",
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      },
      {
        "uuid": "073D474368A248008EE32E88D52A558B",
        "creatorId": "ewsd0001",
        "creator": "超级管理员",
        "createTime": "2023-06-03 10:27:10",
        "modifierId": "ewsd0001",
        "modifier": "超级管理员",
        "modifyTime": "2023-06-03 16:52:41",
        "creatorOrgId": 4,
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat8 C2 L2",
        "sort": 4,
        "remark": "1",
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      },
      {
        "uuid": "FD743F68B9324898B535DB59D9EA2596",
        "creatorId": "ewsd0001",
        "creator": "超级管理员",
        "createTime": "2023-06-03 10:36:21",
        "modifierId": "ewsd0001",
        "modifier": "超级管理员",
        "modifyTime": "2023-06-03 16:53:23",
        "creatorOrgId": 4,
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat9 C2 L2",
        "sort": 5,
        "remark": "1",
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      }
    ],
    "hasChildren": true,
    "type": "folder",
    "slots": {
      "icon": "folder"
    },
    "logs": null
  },
  {
    "uuid": "shandong",
    "creatorId": null,
    "creator": null,
    "createTime": null,
    "modifierId": null,
    "modifier": null,
    "modifyTime": null,
    "creatorOrgId": null,
    "pid": null,
    "folderName": "Sentinel",
    "sort": 1,
    "remark": null,
    "levelId": 1,
    "children": [
      {
        "uuid": "yantai",
        "creatorId": null,
        "creator": null,
        "createTime": null,
        "modifierId": null,
        "modifier": null,
        "modifyTime": null,
        "creatorOrgId": null,
        "pid": "shandong",
        "folderName": "Sentinel-1 SAR GRD",
        "sort": 1,
        "remark": null,
        "levelId": 2,
        "children": [
          {
            "uuid": "kaifaqu",
            "creatorId": null,
            "creator": null,
            "createTime": null,
            "modifierId": null,
            "modifier": null,
            "modifyTime": null,
            "creatorOrgId": null,
            "pid": "yantai",
            "folderName": "Sentinel-2 L2A",
            "sort": 1,
            "remark": null,
            "levelId": 3,
            "children": [],
            "hasChildren": true,
            "type": "folder",
            "slots": {
              "icon": "folder"
            },
            "logs": null
          }
        ],
        "hasChildren": true,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      },
      {
        "uuid": "qingdao",
        "creatorId": null,
        "creator": null,
        "createTime": null,
        "modifierId": null,
        "modifier": null,
        "modifyTime": null,
        "creatorOrgId": null,
        "pid": "shandong",
        "folderName": "Sentinel-3 OLCI",
        "sort": 2,
        "remark": null,
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      },
      {
        "uuid": "qingdao",
        "creatorId": null,
        "creator": null,
        "createTime": null,
        "modifierId": null,
        "modifier": null,
        "modifyTime": null,
        "creatorOrgId": null,
        "pid": "shandong",
        "folderName": "Sentinel-5p OFFL",
        "sort": 2,
        "remark": null,
        "levelId": 2,
        "children": [],
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
        "logs": null
      }
    ],
    "hasChildren": true,
    "type": "folder",
    "slots": {
      "icon": "folder"
    },
    "logs": null
  }
]

const arrayData = [
  {
    "pid": null,
    "id": "0-0",
    "title": "非危化文件夹（示例）",
    "key": "0-0",
    "layer": 0,
    "type": "",
    "hasChildren": true
  },
  {
    "pid": "0-0",
    "id": "0-0-0",
    "title": "山东文件夹",
    "key": "0-0-0",
    "layer": 1,
    "type": "",
    "hasChildren": true
  },
  {
    "pid": "0-0-0",
    "id": "0-0-0-0",
    "title": "青岛点位图层",
    "key": "0-0-0-0",
    "layer": 2,
    "type": "map",
    "hasChildren": false
  },
  {
    "pid": "0-0-0",
    "id": "0-0-0-1",
    "title": "烟台点位图层",
    "key": "0-0-0-1",
    "layer": 2,
    "type": "map",
    "hasChildren": true
  },
  {
    "pid": "0-0-0-1",
    "id": "0-0-0-1-0",
    "title": "P4151 万华仓库东门",
    "key": "0-0-0-1-0",
    "layer": 3,
    "type": "",
    "hasChildren": false
  },
  {
    "pid": "0-0",
    "id": "0-0-1",
    "title": "江苏文件夹",
    "key": "0-0-1",
    "layer": 1,
    "type": "",
    "hasChildren": true
  },
  {
    "pid": "0-0-1",
    "id": "0-0-1-0",
    "title": "点位图层",
    "key": "0-0-1-0",
    "layer": 2,
    "type": "map",
    "hasChildren": false
  }
]

const expandedKeys = ref(['0-0-0', '0-0-1', '0-0-0-1'])
const nodeKey = ref('')
const nodeTitle = ref('全部节点')
const propertyTitle = ref('')
const nodeShow = ref(true)
const propertyShow = ref(false)
const propertyTabActiveKey = ref()
const propertyPanes = ref<any[]>([])
const newTabIndex = ref(0)
const tabPosition = ref('bottom')
const labelCol = ref({span: 4})
const wrapperCol = ref({span: 16})
const collapseActiveKey = ref(['1', '2', '3'])
const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'
const searchValue = ref()
const INITIAL_DATA = {
  folderName: '',
  sort: '',
  remark: '',
  pid: '',
}
const formData = ref({...INITIAL_DATA})
const formRef = ref()
const rules = {
  // folderName: [{required: true, message: '请输入名称', trigger: 'change'}],
  // sort: [{required: true, message: '请输入0到9，最多两位小数', trigger: 'blur',}],
}
const recordColumns = [
  {
    // title: "版本",
    dataIndex: "version",
    align: "center",
  },
  {
    // title: "编辑类型",
    dataIndex: "editType",
    align: "center",
    // width: 70,
  },
  {
    // title: "操作人员",
    dataIndex: "editUser",
    align: "center",
    // width:100,
  },
  {
    // title: "操作时间",
    dataIndex: "editTime",
    align: "center",
  },
]
const url = reactive({
  getPageSet: '/line/eleFolder/getPageSet',
  folderSave: '/line/eleFolder/save',
  folderUpdate: '/line/eleFolder/update',
  folderDetail: '/line/eleFolder/getDetailByUuid',
  folderDelete: '/line/eleFolder/delete',
})
const map = ref()

const initMap = () => {
  // const projection = olProj.get('EPSG:3857')
  // const resolutions: any[] = [];
  // for(let i=0; i<19; i++){
  //   resolutions[i] = Math.pow(2, 18-i);
  // }
  // const tileGrid  = new TileGrid({
  //   origin: [0,0],
  //   resolutions: resolutions
  // });
  // const baidu_source = new TileImage({
  //   projection: projection,
  //   tileGrid: tileGrid,
  //   tileUrlFunction: function(tileCoord, pixelRatio, proj){
  //     if(!tileCoord){
  //       return "";
  //     }
  //     let z = tileCoord[0];
  //     let x = tileCoord[1];
  //     let y = tileCoord[2];
  //
  //     if(x<0){
  //       x = "M"+(-x);
  //     }
  //     if(y<0){
  //       y = "M"+(-y);
  //     }
  //     return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x="+x+"&y="+y+"&z="+z+"&styles=pl&udt=20151021&scaler=1&p=1";
  //   }
  // });
  // 实例化map对象加载地图
  map.value = new Map({
    target: 'map',
    // 地图容器中加载的图层
    layers:[
      new TileLayer({
        // source: baidu_source
        source: new XYZ({
          url: 'http://webrd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
        }),
      })
    ],
    view: new View({
      zoom: 12,
      projection: 'EPSG:4326',
      center: [116.06, 39.67],
    }),
  })
}

const getTreeData = (unfoldType = 'element') => {
  treeData.value = []
  request.post({url: url.getPageSet, data: {unfoldType: unfoldType}}).then((res) => {
    if (res.statusCode === 200) {
      treeData.value = res.data.rows
    }
  });
}

function handleTreeClick(data) {
  // console.log('data', data)
  nodeKey.value = data.uuid ? data.uuid : ''
}

function handleTreeCheck(e) {
  console.log('e', e)
}

const handleNodeClose = (e) => {
  nodeShow.value = false
}
const handlePropertyClose = (e) => {
  propertyShow.value = false
  propertyPanes.value = []
}

function handlePropertyTabEdit(targetKey, action) {
  // console.log('targetKey', targetKey)
  // console.log('action', action)
  // this[action](targetKey);
  if (action === 'add') {
    // add();
  } else {
    remove(targetKey as string);
  }
}

const remove = (targetKey) => {
  // console.log('targetKey',targetKey)
  let activeKey = propertyTabActiveKey.value;
  let lastIndex;
  propertyPanes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  const panes = propertyPanes.value.filter(pane => pane.key !== targetKey);
  if (panes.length && activeKey === targetKey) {
    if (lastIndex >= 0) {
      activeKey = panes[lastIndex].key;
    } else {
      activeKey = panes[0].key;
    }
  }
  propertyPanes.value = panes;
  propertyTabActiveKey.value = activeKey;
}

function handleCreate(e) {
  resetFromData()
  let key = e
  if (key === '5') {
    propertyShow.value = true
    propertyTitle.value = '文件夹创建'
    formData.value.pid = nodeKey.value
    const newTabActiveKey = `newTab${newTabIndex.value++}`;
    propertyPanes.value.push({
      tab: '文件夹创建', key: newTabActiveKey, formData: {}, editRecord: [],
      editRecordShow: false, propertyOkShow: true
    })
    propertyTabActiveKey.value = newTabActiveKey
    // console.log('propertyPanes', this.propertyPanes)
  }
}

const hasPaneKey = (key) => {
  let has = false
  propertyPanes.value.map(item => {
    if (item.key === key) has = true
  })
  return has
}

function handleNodeItem(e, title, nodeItemKey) {
  // console.log('this.propertyPanes', this.propertyPanes)
  // const that = this
  let key = e
  if (key === '1') {
    request.post({url: url.folderDetail, data: {uuid: nodeItemKey}}).then((res) => {
      if (res.statusCode === 200) {
        propertyShow.value = true
        propertyTitle.value = '文件夹详情'
        formData.value = res.data
        let hasPaneKey1 = hasPaneKey(`D${nodeItemKey}`)
        if (hasPaneKey1) {
          ElMessage.warning({message: '请勿重复操作数据！', duration: 1500})
          return
        }
        propertyPanes.value.push({
          tab: `${title} 详情`, key: `D${nodeItemKey}`, formData: res.data,
          editRecord: res.data.logs, editRecordShow: true, propertyOkShow: false
        })
        propertyTabActiveKey.value = `D${nodeItemKey}`
      }
    });
  }
  if (key === '2') {
    request.post({url: url.folderDetail, data: {uuid: nodeItemKey}}).then((res) => {
      if (res.statusCode === 200) {
        propertyShow.value = true
        propertyTitle.value = '文件夹编辑'
        formData.value = res.data
        let hasPaneKey1 = hasPaneKey(`E${nodeItemKey}`)
        if (hasPaneKey1) {
          ElMessage.warning({message: '请勿重复操作数据！', duration: 1500})
          return
        }
        propertyPanes.value.push({
          tab: `${title} 编辑`, key: `E${nodeItemKey}`, formData: res.data,
          editRecord: res.data.logs, editRecordShow: true, propertyOkShow: true
        })
        propertyTabActiveKey.value = `E${nodeItemKey}`
      }
    });
  }
  if (key === '3') {
    ElMessageBox.confirm("确定要执行该操作吗?", '警告', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'error'
        }
    ).then(res => {
          request.post({url: url.folderDelete, data: {uuid: nodeItemKey}}).then((res) => {
            if (res.statusCode === 200 || res === 1) {
              ElMessage.success({message: res.message, duration: 1500})
              getTreeData();
            } else {
              ElMessage.error({message: res.message, duration: 1500})
            }
          })
        }
    )
  }
}

function handlePropertyOk(paneKey, index) {
  // console.log('this.propertyPanes[index]', this.propertyPanes[index])
  let formData = propertyPanes.value[index].formData
  let url1 = formData.uuid ? url.folderUpdate : url.folderSave
  let validList = formRef.value.map(item => {
    let valid
    item.validate(v => {
      valid = v
    })
    return valid
  })
  if (validList.indexOf(false) === -1 && validList.indexOf(undefined) === -1) {
    request.post({url: url1, data: formData.value}).then((res) => {
      if (res.statusCode === 200) {
        ElMessage.success({message: res.message || '操作成功', duration: 1500})
        remove(paneKey)
        getTreeData();
      }
    });
  }
}

const handleInputSearch = (e) => {
  console.log('e', e)
  // const value = e.target.value;
  const value = e;
  let expandedKeys1: any[] = []
  let dataList = flattenTree(treeData.value)
  dataList.map(item => {
    if (item.title.indexOf(value) > -1) {
      // console.log('item', item)
      let arr = treeFindPath(treeData.value, data => data.key === item.key, "key");
      // console.log('arr', arr)
      arr.map(item => {
        expandedKeys1.push(item)
      })
    }
  })
  expandedKeys.value = Array.from(new Set(expandedKeys1))
}

function onSearchClick(e) {
  console.log('click e', e)
}

function handleReload(e) {
  nodeKey.value = ''
  getTreeData();
}

const resetFromData = () => {
  formData.value = JSON.parse(JSON.stringify(INITIAL_DATA))
}

function handleFold(e) {
  let key = e.key
  let expandedKeys1: any[] = []
  let dataList = flattenTree(treeData.value)
  if (key === '1') {
    expandedKeys.value = []
  }
  if (key === '2') {
    dataList.map(item => {
      if (item.type === 'map') {
        let arr = treeFindPath(treeData.value, data => data.key === item.key, "key");
        arr.map(item => {
          expandedKeys1.push(item)
        })
      }
    })
    expandedKeys.value = Array.from(new Set(expandedKeys1))
  }
  if (key === '3') {
    dataList.map(item => {
      if (item.layer === 1) {
        let arr = treeFindPath(treeData.value, data => data.key === item.key, "key");
        arr.map(item => {
          expandedKeys1.push(item)
        })
      }
    })
    expandedKeys.value = Array.from(new Set(expandedKeys1))
  }
  console.log('expandedKeys', expandedKeys.value)
}


function treeFindPath(tree, func, field = "", path: any = []) {
  if (!tree) return []
  for (const data of tree) {
    field === "" ? path.push(data) : path.push(data[field]);
    // console.log('path',path)
    if (func(data)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, field, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

function flattenTree(data, pid = null, res: any = []) {
  data.forEach(item => {
    res.push({
      pid: pid,
      id: item.key,
      title: item.title,
      key: item.key,
      layer: item.layer,
      type: item.type,
      hasChildren: item.hasChildren
    })
    if (item.hasChildren) {
      flattenTree(item.children, item.key, res)
    }
  })
  return res
}

function getTree(data, pid = null) {
  const res: any = [];
  data.forEach(item => {
    if (item.pid === pid) {
      const children = getTree(data.filter(v => v.pid !== pid), item.id);
      if (children.length) {
        res.push({...item, children})
      } else {
        res.push({...item})
      }
    }
  });
  return res;
}

function onContextMenuClick(treeKey, menuKey) {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
}


function onDragEnter(e) {

}

function onDrop(e) {

}

function getParentKey(key, tree) {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}


onMounted(() => {
  // getTreeData()
  // 初始化地图
  initMap()
})
</script>

<style scoped lang="scss">
.content {
  //padding:20px;
  width: 100%;
  height: calc(100vh - 54px - 40px);
  display: flex;
}

.node-class {
  width: 360px;
  height: 100%;
  background: #fff;

  /*display: flex;*/

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    text-align: left;
    align-items: center;
    font-size: 16px;
    padding: 0 20px 0 20px;
    background: #e8e8e8;
    justify-content: space-between;
  }

  .operate {
    display: flex;
    padding: 5px 0
  }

  .node-tree {
    /*height: 100%;*/
    height: calc(100vh - 240px);
    width: 100%;
    overflow-y: auto;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

}

.node-tab {
  /*height:*/
}

.margin-r5 {
  margin-right: 5px
}

.margin-r10 {
  margin-right: 10px
}

.margin-l10 {
  margin-left: 10px
}

.map-class{
  width:calc(100vw - 360px);
}


.property-class {
  position: absolute;
  right: 0;
  width: 360px;
  height: 100%;
  background: #fff;
  overflow-y: hidden;

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    text-align: left;
    align-items: center;
    font-size: 16px;
    padding: 0 20px 0 20px;
    background: #e8e8e8;
    justify-content: space-between;
  }

  .property-operate {
    display: flex;
    justify-content: center;
    padding-top: 50px;
  }

  .property-form {
    height: calc(100vh - 200px);
    width: 100%;
    padding:10px;
    overflow-y: auto;
  }

}
</style>