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
<!--          <el-icon><Plus /></el-icon>-->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in createList" :command="item.command" :icon="item.icon">
                {{ item.menu }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown class="margin-r5" @command="handleFold">
          <el-button :icon="ArrowDown"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in foldList" :command="item.command">
                {{ item.menu }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="margin-r5" :icon="Filter"/>
      </div>
<!--      节点树-->
      <el-tabs v-model="nodeTabActiveName" :tab-position="tabPosition" class="node-tab">
        <el-tab-pane v-for="(item, index) in nodePanes" :label="item.label" :name="item.name">
          <div class="node-tree">
            <el-tree
                :data="treeData"
                :props="replaceFields"
                @node-click="handleTreeClick"
                show-checkbox
                @check="handleTreeCheck"
                node-key="uuid"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
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
                        <el-dropdown-item
                            v-for="(item, index) in operateList"
                            :command="item.command"
                            :divided="item.command==='6'"
                        >
                          {{item.menu}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </span>
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--    地图-->
    <div v-if="imageUrl === '' " class="map-class" id='map'>
    </div>
    <div v-else class="center-class">
      <div class="center-content">
        <img id='imageId' ref='imageRef' :src='imageUrl' width='640' height='480'/>
        <video ref='webcamRef' width='640' height='480'></video>
        <canvas ref='canvasRef' width='640' height='480'/>
      </div>
    </div>

    <!--    属性-->
    <div class="property-class" v-show="propertyShow">
      <div class="title">{{ propertyTitle }}
        <el-icon @click="handlePropertyClose">
          <Close/>
        </el-icon>
      </div>
      <el-tabs v-model="propertyTabActiveKey" :tab-position="tabPosition"
               @edit="handlePropertyTabEdit" closable>
        <el-tab-pane v-for="(pane, index) in propertyPanes" :name="pane.key" :label="pane.tab">
          <div class="property-form">
            <collapse-panel :active-names="landslideCollapseActiveNames" :data-list="pane.collapse">
              <template #基础信息>
                <landslide-form collapse-panel="基础信息" :form-data="pane.formData"></landslide-form>
              </template>
              <template #处理结果>
                <landslide-form collapse-panel="处理结果" :form-data="pane.formData"></landslide-form>
              </template>
              <template #编辑记录>
                <el-table :columns="recordColumns" :data="pane.editRecord" :pagination="false" rowKey="dataIndex">
                </el-table>
              </template>
            </collapse-panel>
            <div class="property-operate">
              <el-button class="margin-r10" @click="handleProcessing(pane.key, index, pane.type)">处理分析</el-button>
              <el-button class="margin-r10" @click="remove(pane.key)">取消</el-button>
              <el-button type="primary" @click="handlePropertyOk(pane.key, index, pane.type)" v-show="pane.propertyOkShow">确定
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
  Close, MoreFilled,Platform,Reading
} from "@element-plus/icons-vue";
import Map from "ol/Map";
import {Tile as TileLayer} from "ol/layer";
import {XYZ} from "ol/source";
import View from "ol/View";
import CollapsePanel from "@/components/CollapsePanel/index.vue"
import LandslideForm from "@/views/vision/earth/landslide-form.vue";

defineOptions({
  name: 'image-processing'
})
/** 全局类型*/
const type = ref(null||'')

/** 节点数据*/
const nodeTitle = ref('全部节点')
const nodeShow = ref(true)
const nodePanes = ref([
  {label: 'All', name: '1',},
  {label: '地球视觉', name: '2',},
])
const nodeTabActiveName = ref('1')
const treeData = ref<any[]>([])
const treeSelectData = ref<any[]>([])
const expandedKeys = ref(['0-0-0', '0-0-1', '0-0-0-1'])
const replaceFields = {label: "folderName"}
const nodeKey = ref(null)
const searchValue = ref()
const createList = ref([
  {command: '1', menu: '滑坡检测', icon: 'Reading'},
])
const foldList = ref([
  {command: '1', menu: '全部折叠'},
  {command: '2', menu: '展开至图层'},
  {command: '3', menu: '展开至1级要素'},
  {command: '4', menu: '展开至元素'},
])
const operateList = ref([
  {command: '1', menu: '详情'},
  {command: '2', menu: '编辑'},
  {command: '3', menu: '删除'},
  {command: '4', menu: '复制'},
  {command: '5', menu: '移动'},
  {command: '6', menu: '勾选以下'},
  {command: '7', menu: '取消勾选以下'},
  {command: '8', menu: '新建文件夹'},
  {command: '9', menu: '新建图层'},
  {command: '10', menu: '作为根节点查看'},
])
treeData.value = [
  {
    "uuid": "BCB5C74B9C86485F8623A8A02A9F204F",
    "pid": "",
    "folderName": "Landsat",
    "children": [
      {
        "uuid": "F9AF1DA5DF21495DBA1B552FA01E1ABC",
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat5 C2 L2",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      },
      {
        "uuid": "E57DD42B708E45F39DC1112CEB5BADA8",
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat7 C2 L2",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      },
      {
        "uuid": "073D474368A248008EE32E88D52A558B",
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat8 C2 L2",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      },
      {
        "uuid": "FD743F68B9324898B535DB59D9EA2596",
        "pid": "BCB5C74B9C86485F8623A8A02A9F204F",
        "folderName": "Landsat9 C2 L2",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      }
    ],
    "hasChildren": true,
    "type": "folder",
    "slots": {
      "icon": "folder"
    },
  },
  {
    "uuid": "shandong",
    "pid": null,
    "folderName": "Sentinel",
    "children": [
      {
        "uuid": "yantai",
        "pid": "shandong",
        "folderName": "Sentinel-1 SAR GRD",
        "children": [
          {
            "uuid": "kaifaqu",
            "pid": "yantai",
            "folderName": "Sentinel-2 L2A",
            "sort": 1,
            "hasChildren": true,
            "type": "folder",
            "slots": {
              "icon": "folder"
            },
          }
        ],
        "hasChildren": true,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      },
      {
        "uuid": "qingdao",
        "pid": "shandong",
        "folderName": "Sentinel-3 OLCI",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      },
      {
        "uuid": "qingdao",
        "pid": "shandong",
        "folderName": "Sentinel-5p OFFL",
        "hasChildren": false,
        "type": "folder",
        "slots": {
          "icon": "folder"
        },
      }
    ],
    "hasChildren": true,
    "type": "folder",
    "slots": {
      "icon": "folder"
    },
  }
]

/** 属性数据*/
const propertyTitle = ref('')
const propertyShow = ref(false)
const propertyTabActiveKey = ref()
const propertyPanes = ref<any[]>([])
const newTabIndex = ref(0)
const tabPosition = ref('bottom')

/** 表单数据*/
const formRef = ref()
const labelCol = ref({span: 4})
const wrapperCol = ref({span: 16})
const collapseActiveKey = ref(['1', '2', '3'])
const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'
const INITIAL_DATA = {
  folderName: '',
  sort: '',
  remark: '',
  pid: null,
}
const formData = ref({...INITIAL_DATA})

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

/** 滑坡*/
const landslideCollapse = ref([
  {name: '1', title: '基础信息', slot: '基础信息', show: true},
  {name: '2', title: '处理结果', slot: '处理结果', show: true},
  {name: '3', title: '编辑记录', slot: '编辑记录', show: true},
])
const landslideCollapseActiveNames = ref(['1', '2'])

/** 接口*/
const url = reactive({
  getPageSet: '/line/eleFolder/getPageSet',
  folderSave: '/line/eleFolder/save',
  folderUpdate: '/line/eleFolder/update',
  folderDetail: '/line/eleFolder/getDetailByUuid',
  folderDelete: '/line/eleFolder/delete',
})

/** 地图*/
const map = ref()
const imageUrl = ref('')
const imageRef = ref()

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
    layers: [
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
  if (key === '1') {
    // if (this.parentType !== '' && this.parentType !== 'layer' || this.parentType === 'layer' && this.elementType !== '点') {
    //   ElMessage.warning({message: '请选择支持要素类型为点的图层创建！', duration: 1500})
    //   return false
    // }
    type.value = 'landslide'
    propertyShow.value = true
    propertyTitle.value = '滑坡检测创建'
    const newTabActiveKey = `N-${newTabIndex.value++}`;
    // changeCollapse('', false)
    propertyPanes.value.push({
      tab: propertyTitle.value,
      key: newTabActiveKey,
      collapse: JSON.parse(JSON.stringify(landslideCollapse.value)),
      formData: {folderId: nodeKey.value, menuType: type.value, },
      editRecord: [],
      propertyOkShow: true,
      type: type.value
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
        let hasPaneKey1 = hasPaneKey(`D-${nodeItemKey}`)
        if (hasPaneKey1) {
          propertyTabActiveKey.value = `D-${nodeItemKey}`
          return
        }
        propertyPanes.value.push({
          tab: `${title} 详情`, key: `D-${nodeItemKey}`, formData: res.data,
          editRecord: res.data.logs, editRecordShow: true, propertyOkShow: false
        })
        propertyTabActiveKey.value = `D-${nodeItemKey}`
      }
    });
  }
  if (key === '2') {
    request.post({url: url.folderDetail, data: {uuid: nodeItemKey}}).then((res) => {
      if (res.statusCode === 200) {
        propertyShow.value = true
        propertyTitle.value = '文件夹编辑'
        formData.value = res.data
        let hasPaneKey1 = hasPaneKey(`E-${nodeItemKey}`)
        if (hasPaneKey1) {
          propertyTabActiveKey.value = `E-${nodeItemKey}`
          return
        }
        propertyPanes.value.push({
          tab: `${title} 编辑`, key: `E-${nodeItemKey}`, formData: res.data,
          editRecord: res.data.logs, editRecordShow: true, propertyOkShow: true
        })
        propertyTabActiveKey.value = `E-${nodeItemKey}`
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
const handleProcessing = (paneKey, index, type) => {
  // console.log('type', type)
  // console.log('propertyPanes.value', propertyPanes.value[0].formData)
  let url = '/detect/daUnet'
  let data = {
    filename: propertyPanes.value[0].formData.picture
  }
  request.post({url:url, baseUrl:'ALGORITHM_URL', data: data}).then(res=>{
    console.log('res', res)
    propertyPanes.value[0].formData.resultUrl = res.resultUrl
    imageUrl.value = res.resultUrl
  })
}

function handlePropertyOk(paneKey, index, type) {
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
  nodeKey.value = null
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

.map-class {
  width: calc(100vw - 360px);
}
.center-class {
  width: calc(100vw - 360px - 360px);
  height: 100%;
}

.center-content {
  position: relative;
  margin-top: 100px;
  margin-left: 100px;
}

.center-content canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.center-content video {
  position: absolute;
  top: 0;
  left: 0;
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
    padding: 10px;
    overflow-y: auto;
  }

}
</style>