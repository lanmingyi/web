<template>
  <div class='container'>
    <div class='map-toolbar'>
      <div>
        <input type='button' class='map-button' id='zoom-out' value='单击缩小' @click='operateMap'/>
        <input type='button' class='map-button' id='zoom-in' value='单击放大' @click='operateMap'/>
        <input type='button' class='map-button' id='pan-to' value='平移到【中国】' @click='operateMap'/>
        <input type='button' class='map-button' id='restore' value='复位' @click='operateMap'/>
        <input type='button' class='map-button' id='addGEOJSON' value='加载GEOJSON' @click='loadVectData'/>
        <input type='button' class='map-button' id='pan-to-mierune' value='平移到mierune' @click='operateMap'/>
      </div>
      <el-dropdown trigger="click" @command="handleCommand">
        <div class='map-menu'>
          <span class="map-menu-button">
            <span class="map-menu-label">Map & Tools</span>
            <!--            <el-icon class="map-menu-icon"><Operation /></el-icon>-->
            <el-icon><Operation/></el-icon>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="map-menu-item">
            <el-dropdown-item command="图层">
              <el-icon>
                <Setting/>
              </el-icon>
              图层列表
            </el-dropdown-item>
            <el-divider/>
            <el-dropdown-item command="工具">
              <el-icon>
                <Setting/>
              </el-icon>
              工具
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div id='map' class='map'>
      <div id='mouse-position'></div>
      <div v-if="layerShow" id='layer-control' class='layer-control'>
        <div class='title'><label>图层列表</label></div>
        <!--        <ul id='layer-tree' class='layer-tree'></ul>-->
        <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="id"
            show-checkbox
            @check="handleClick"
        />
      </div>
      <div v-if="drawShow" id='layer-control' class='layer-control'>
        <div class='title'><label>Geometry type</label></div>
        <!--        <ul id='layer-tree' class='layer-tree'></ul>-->
        <el-select v-model="geometryType" class="m-2" placeholder="Select" size="large" @change="selectChange">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
// import TileLayer from 'ol/layer/Tile'
// import VectorLayer from 'ol/layer/Vector';

import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import {defaults,ZoomSlider,ZoomToExtent,MousePosition,ScaleLine,OverviewMap,FullScreen } from 'ol/control'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';

// import ZoomSlider from 'ol/control/ZoomSlider'
// import ZoomToExtent from 'ol/control/ZoomToExtent'
// import MousePosition from 'ol/control/MousePosition'
import * as olCoordinate from 'ol/coordinate'
import * as olProj from 'ol/proj'
// import {defaults} from 'ol/control/defaults'
// import ScaleLine from 'ol/control/ScaleLine'
// import OverviewMap from 'ol/control/OverviewMap'
// import FullScreen from 'ol/control/FullScreen'
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import CircleStyle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';


import {ref, onMounted} from "vue";

import {
  Operation,
  Setting,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from '@element-plus/icons-vue'

defineOptions({
  name: 'OpenlayersDemo'
})

const map = ref()
//map中的图层数组
const layer = ref<any[]>([])
//图层名称数组
const layerName = ref<any[]>([])
//图层可见属性数组
const layerVisibility = ref<any[]>([])

const vectorSource = ref()
const vectorLayer = ref()

const treeData = ref<any[]>([])
const treeRef = ref()
const layerShow = ref(false)
const drawShow = ref(false)
const geometryType = ref()
const draw = ref()
const snap = ref()


const options = [
  {
    value: 'Point',
    label: 'Point',
  },
  {
    value: 'LineString',
    label: 'LineString',
  },
  {
    value: 'Polygon',
    label: 'Polygon',
  },
  {
    value: 'Circle',
    label: 'Circle',
  },
]


const createMap = () => {
  // 实例化矢量数据源
  vectorSource.value = new VectorSource()
  // 矢量层数据
  vectorLayer.value = new VectorLayer({
    //矢量数据源
    source: vectorSource.value,
    //样式设置
    style: styleFunction
  })

  //鼠标位置控件
  //实例化鼠标位置控件(MousePosition)
  const mousePositionControl = new MousePosition({
    //坐标格式
    coordinateFormat: olCoordinate.createStringXY(4),   //将坐标保留4位小数位，并转换为字符串
    //地图投影坐标
    projection: 'EPSG:4326',
    //坐标显示样式，默认为ol-mouse-position
    className: 'custom-mouse-position',
    //显示鼠标位置信息的目标地图容器
    target: document.getElementById('mouse-position'),
    //未定义坐标的标记
    undefinedHTML: '&nbsp;'       //鼠标离开地图时，显示空格
  })

  //实例化比例尺控件（ScaleLine）
  const scaleLineControl = new ScaleLine({
    //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
    units: 'metric'
  })

  //实例化ZoomSlider控件并加载到地图容器中
  // this.map.addControl(new ZoomSlider)
  //实例化zoomToExtent控件并加载到地图容器中
  const zoomToExtent = new ZoomToExtent({
    extent: [
      93.7598, 52.1387,
      129.9707, 68.3691
    ]
  })

  //实例化map对象加载地图
  map.value = new Map({
    //地图容器div的id
    target: 'map',
    //地图容器中加载的图层
    layers: [
      //加载瓦片图层数据
      new TileLayer({
        title: '天地图矢量图层',
        source: new XYZ({
          // url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          url: 'https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          wrapX: false
        })
      }),
      new TileLayer({
        title: '天地图矢量图层注记',
        source: new XYZ({
          // url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          url: 'https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          wrapX: false  /*默认false*/
        })
      }),
      new TileLayer({
        title: '天地图影像图层',
        source: new XYZ({
          url: 'https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          wrapX: false  /*默认false*/
        })
      }),
      new TileLayer({
        title: '天地图影像图层注记',
        source: new XYZ({
          url: 'https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=9bfde22d0ee1892e2864db57ed9d4530',
          wrapX: false  /*默认false*/
        })
      }),

      new TileLayer({
        source: new XYZ({
          url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
          attributions:
              'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
          attributionsCollapsible: false,
          tileSize: [256, 256],
          // minZoom: 0,
          // maxZoom: 18,
        }),
      }),

      // new TileLayer({
      //   source: new OSM()
      // })
    ],
    //地图视图设置
    view: new View({
      //地图初始中心点
      // center: [121.39, 37.54],  // 烟台
      center: olProj.fromLonLat([121.4664, 31.2355]),
      // center: olProj.fromLonLat([139.767, 35.681]),
      //地图初始显示级别
      zoom: 11,
      mixZoom: 1, //缩放的最小级别
      maxZoom: 20 //缩放的最大级别
      // rotation:Math.PI/6,  //顺时针旋转30度
      //参考系设置
      // projection: "EPSG:4326"  // EPSG:3857
    }),
    controls: defaults({//地图中默认控件
      /* @type {ol.control.Attribution} */
      attributionOptions: ({
        //地图数据源信息控件是否可收缩,默认为true
        collapsible: true
      })
    }).extend([mousePositionControl, scaleLineControl, new ZoomSlider(), zoomToExtent, new FullScreen()])
  })
}

const addInteractions = () => {
  draw.value = new Draw({
    source: vectorSource.value,
    type: geometryType.value,
  });
  map.value.addInteraction(draw.value);
  snap.value = new Snap({source: vectorSource.value});
  map.value.addInteraction(snap.value);
}

/**
 * Handle change event.
 */
const selectChange = (data) => {
  console.log('data', data)
  map.value.removeInteraction(draw.value);
  map.value.removeInteraction(snap.value);
  addInteractions();
  //将矢量图层加载到地图中
  map.value.addLayer(vectorLayer.value)
};

const loadLayersControl = () => {
  //图层目录容器
  const treeContent = document.getElementById('layer-tree')
  //获取地图中所有图层
  const layers = map.value.getLayers()
  layer.value = layers.array_
  // console.log('layers', layers)
  // console.log('layer.value', layer.value)
  layer.value.map(item => {
    treeData.value.push({id: item.ol_uid, label: item.values_.title})
  })

  // for (let i = 0; i < layers.getLength(); i++) {
  //   //获取每个图层的名称、是否可见属性
  //   layer.value[i] = layers.item(i)
  //   layerName.value[i] = layer.value[i].get('title')
  //   layerVisibility.value[i] = layer.value[i].getVisible()
  //   //新增li元素，用来承载图层项
  //   const elementLi = document.createElement('li')
  //   // 添加子节点
  //   treeContent.appendChild(elementLi)
  //   //创建复选框元素
  //   const elementInput = document.createElement('input')
  //   elementInput.type = 'checkbox'
  //   elementInput.name = 'layers'
  //   elementLi.appendChild(elementInput)
  //   //创建label元素
  //   const elementLable = document.createElement('label')
  //   elementLable.className = 'layer'
  //   //设置图层名称
  //   setInnerText(elementLable, layerName.value[i])
  //   elementLi.appendChild(elementLable)
  //   //设置图层默认显示状态
  //   if (layerVisibility.value[i]) {
  //     elementInput.checked = true
  //   }
  //   //为checkbox添加变更事件
  //   addChangeEvent(elementInput, layer.value[i])
  // }
}

const handleNodeClick = (data) => {
  console.log('data', data.id)
}
const handleCommand = (command) => {
  layerShow.value = false
  drawShow.value = false
  if (command === '图层') layerShow.value = true
  if (command === '工具') drawShow.value = true

}
const handleClick = (data) => {
  console.log('treeRef.value!.getCheckedKeys(false)', treeRef.value!.getCheckedKeys(false))
  console.log('treeRef.value', treeRef.value)
  console.log('data', data)
  layer.value.map(item => {
    if (item.ol_uid === data.id) {
      item.setVisible(true)
    } else {
      item.setVisible(false)
    }
  })
}
/**
 * 为checkbox元素绑定变更事件
 * @param {input} element checkbox元素
 * @param {ol.layer.Layer} layer 图层对象
 */
const addChangeEvent = (element, layer) => {
  element.onclick = function () {
    if (element.checked) {
      //显示图层
      layer.setVisible(true)
    } else {
      //不显示图层
      layer.setVisible(false)
    }
  }
}

/**
 * 动态设置元素文本内容（兼容）
 */
const setInnerText = (element, text) => {
  if (typeof element.textContent == 'string') {
    element.textContent = text
  } else {
    element.innerText = text
  }
}

const operateMap = (operation) => {
  const view = map.value.getView()
  const zoom = view.getZoom();
  switch (operation.target.id) {
    case 'zoom-out':
      //单击缩小按钮功能
      view.setZoom(zoom - 1)
      break
    case 'zoom-in':
      //单击放大按钮功能
      view.setZoom(zoom + 1)
      break
    case 'pan-to':
      //平移功能（移到到武汉市）
      //平移地图
      view.setCenter(olProj.fromLonLat([105.0098, 35.6543]))
      view.setZoom(5)
      break
    case 'pan-to-mierune':
      view.setCenter(olProj.fromLonLat([139.767, 35.681]))
      view.setZoom(11)
    case 'restore':
      //复位功能（复位到初始状态）
      //初始中心点
      view.setCenter(olProj.fromLonLat([121.4664, 31.2355]))
      //初始旋转角度
      view.setRotation(0)
      //初始缩放级数
      view.setZoom(3)
      break
    default:
      break;
  }
}

const loadVectData = () => {
  if (vectorLayer.value != null || vectorLayer.value == 'undefined') {
    //移除已有矢量图层
    map.value.removeLayer(vectorLayer.value)
  }
  //实例化矢量数据源，用GeoJSON格式的类解析
  vectorSource.value = new VectorSource({
    url: '/310100.json',
    format: new GeoJSON()
  })
  vectorLayer.value = new VectorLayer({
    //矢量数据源
    source: vectorSource.value,
    //样式设置
    style: styleFunction
  })
  //将矢量图层加载到地图中
  map.value.addLayer(vectorLayer.value)
  //获取地图视图
  const view = map.value.getView()
  //平移地图
  // view.setCenter([12536865.056410152, 3635008.742201894])
  view.setCenter(olProj.fromLonLat([121.4664, 31.2355]))
  //地图缩放
  view.setZoom(9)
}

const styleFunction = (feature, resolution) => {
  console.log('feature', feature)
  /**
   *矢量几何要素的样式
   */
  const image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({color: 'red', width: 1})
  });
  const styles = {
    'Point': [
      new Style({
        //点样式
        image: image
      })
    ],
    'LineString': [
      new Style({
        stroke: new Stroke({
          //线的边界样式
          color: 'green',
          width: 1
        })
      })
    ],
    'MultiLineString': [
      new Style({
        stroke: new Stroke({
          //多线的边界样式
          color: 'green',
          width: 1
        })
      })
    ],
    'MultiPoint': [
      new Style({
        //多点的点样式
        image: image
      })
    ],
    'MultiPolygon': [
      new Style({
        stroke: new Stroke({
          //多区的边界样式
          color: 'yellow',
          width: 1
        }),
        fill: new Fill({
          //多区的填充样式
          color: 'rgba(255, 255, 0, 0.1)'
        })
      })
    ],
    'Polygon': [
      new Style({
        stroke: new Stroke({
          //区的边界样式
          color: 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new Fill({
          //区的填充样式
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ],
    'GeometryCollection': [
      new Style({
        stroke: new Stroke({
          //集合要素的边界样式
          color: 'magenta',
          width: 2
        }),
        fill: new Fill({
          //集合要素的填充样式
          color: 'magenta'
        }),
        image: new CircleStyle({
          //集合要素的点样式
          radius: 10,
          fill: null,
          stroke: new Stroke({
            color: 'magenta'
          })
        })
      })
    ],
    'Circle': [
      new Style({
        stroke: new Stroke({
          //圆的边界样式
          color: 'red',
          width: 2
        }),
        fill: new Fill({
          //圆的填充样式
          color: 'rgba(255,0,0,0.2)'
        })
      })
    ]
  };
  //根据要素类型设置几何要素的样式
  return styles[feature.getGeometry().getType()];
}

onMounted(() => {
  createMap();
  //加载图层列表数据
  loadLayersControl()
})


</script>

<!--<style type='text/css' scoped>-->
<style lang="scss" scoped>
.container {
  position: relative;
  //top: 0;
  //left: 0;
  width: 100%;
  height: 100%;
}

.map-toolbar {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 3.5em;
  color: #595959;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0px 2px 4px rgb(136 136 136 / 50%);
  backdrop-filter: blur(3px);
  z-index: 102;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.map-menu {
  text-align: right;
  cursor: default;
  transition: background-color 0.25s;
  outline: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 3.5em;
  flex: 0 0 auto;

  &:hover {
    background: #a0a0a0;
    color: white;
  }
}

.map-menu-button {
  margin-right: 1em;
  width: 19em;
  display: inline-block;
}

.map-menu-label {
  font-weight: bold;
  transition: color 0.25s;
}

.map-menu-icon {
  font-size: 15px;
  color: #595959;
  padding: 0.25em;
  margin: 0 1em;
  border: 2px solid #595959;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}

.map-menu-item {
  right: 0;
  //box-shadow: 0px 2px 4px rgb(136 136 136 / 50%);
  width: 20em;
  max-width: 100vw;
}


.map {
  //position: relative;
  width: 100%;
  height: 800px;
}

//#mouse-position {
//  float: left;
//  position: absolute;
//  bottom: 50px;
//  width: 200px;
//  height: 20px;
//  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
//  z-index: 2000;
//}

/* 鼠标位置信息自定义样式设置 */
.custom-mouse-position {
  color: rgb(255, 0, 0);
  font-size: 16px;
  /*font-family: "微软雅黑";*/
}

/* 图层控件层样式设置 */
.layer-control {
  position: absolute;
  //bottom: 5px;
  width: 20em;
  max-height: 200px;
  right: 0px;
  top: 50px;
  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
  z-index: 100;
  //color: #ffffff;
  background-color: #ffffff;
  /*边缘的宽度*/
  //border-width: 10px;
  /*圆角的大小 */
  //border-radius: 5px;
  /*边框颜色*/
  //border-color: #000 #000 #000 #000;
}

.layer-control .title {
  font-weight: bold;
  font-size: 15px;
  margin: 10px;
}

.layer-tree li {
  list-style: none;
  margin: 5px 10px;
}
</style>
