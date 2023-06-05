<template>
  <div class='container'>
    <div class='TopBar'>
      <div>
        <input type='button' class='ButtonLib' id='zoom-out' value='单击缩小' @click='operateMap'/>
        <input type='button' class='ButtonLib' id='zoom-in' value='单击放大' @click='operateMap'/>
        <input type='button' class='ButtonLib' id='pan-to' value='平移到【中国】' @click='operateMap'/>
        <input type='button' class='ButtonLib' id='restore' value='复位' @click='operateMap'/>
        <input type='button' class='ButtonLib' id='addGEOJSON' value='加载GEOJSON' @click='loadVectData' />
      </div>
      <el-dropdown trigger="click" @command="handleCommand">
        <div class='MapMenu'>
          <span class="mapmenu-button">
            <span class="mapmenu-label">Map & Tools</span>
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
      <div id='layerControl' class='layerControl'>
        <div class='title'><label>图层列表</label></div>
        <ul id='layerTree' class='layerTree'></ul>
      </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import ZoomSlider from 'ol/control/ZoomSlider'
import ZoomToExtent from 'ol/control/ZoomToExtent'
import MousePosition from 'ol/control/MousePosition'
import * as olCoordinate from 'ol/coordinate'
import * as olProj from 'ol/proj'
import { defaults } from 'ol/control/defaults'
import ScaleLine from 'ol/control/ScaleLine'
import OverviewMap from 'ol/control/OverviewMap'
import FullScreen from 'ol/control/FullScreen'
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import CircleStyle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';

export default {
  name: 'OpenlayersDemo',
  data() {
    return {
      map: null,
      //map中的图层数组
      layer: [],
      //图层名称数组
      layerName: [],
      //图层可见属性数组
      layerVisibility: [],
      vectorLayer: '',
    }
  },
  mounted() {
    this.createMap();
    //加载图层列表数据
    this.loadLayersControl()
  },
  methods: {
    createMap(){
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
      this.map = new Map({
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
          })

          // new TileLayer({
          //   source: new OSM()
          // })
        ],
        //地图视图设置
        view: new View({
          //地图初始中心点
          // center: [121.39, 37.54],  // 烟台
          center: olProj.fromLonLat([121.4664, 31.2355]),
          //地图初始显示级别
          zoom: 10,
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
    },

    loadLayersControl() {
      //图层目录容器
      const treeContent = document.getElementById('layerTree')
      //获取地图中所有图层
      const layers = this.map.getLayers()
      for (let i = 0; i < layers.getLength(); i++) {
        //获取每个图层的名称、是否可见属性
        this.layer[i] = layers.item(i)
        this.layerName[i] = this.layer[i].get('title')
        this.layerVisibility[i] = this.layer[i].getVisible()
        //新增li元素，用来承载图层项
        const elementLi = document.createElement('li')
        // 添加子节点
        treeContent.appendChild(elementLi)
        //创建复选框元素
        const elementInput = document.createElement('input')
        elementInput.type = 'checkbox'
        elementInput.name = 'layers'
        elementLi.appendChild(elementInput)
        //创建label元素
        const elementLable = document.createElement('label')
        elementLable.className = 'layer'
        //设置图层名称
        this.setInnerText(elementLable, this.layerName[i])
        elementLi.appendChild(elementLable)
        //设置图层默认显示状态
        if (this.layerVisibility[i]) {
          elementInput.checked = true
        }
        //为checkbox添加变更事件
        this.addChangeEvent(elementInput, this.layer[i])
      }
    },

    selectLayers(){

    },

    /**
     * 为checkbox元素绑定变更事件
     * @param {input} element checkbox元素
     * @param {ol.layer.Layer} layer 图层对象
     */
    addChangeEvent(element, layer) {
      element.onclick = function() {
        if (element.checked) {
          //显示图层
          layer.setVisible(true)
        } else {
          //不显示图层
          layer.setVisible(false)
        }
      }
    },

    /**
     * 动态设置元素文本内容（兼容）
     */
    setInnerText(element, text) {
      if (typeof element.textContent == 'string') {
        element.textContent = text
      } else {
        element.innerText = text
      }
    },

    operateMap(operation){
      const view = this.map.getView();
      const zoom = view.getZoom();
      switch (operation.target.id){
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
    },

    loadVectData() {
      if (this.vectorLayer != null || this.vectorLayer == 'undefined') {
        //移除已有矢量图层
        this.map.removeLayer(this.vectorLayer)
      }
      //实例化矢量数据源，用GeoJSON格式的类解析
      const vectorSource = new VectorSource({
        url: '/310100.json',
        format: new GeoJSON()
      })
      this.vectorLayer = new VectorLayer({
        //矢量数据源
        source: vectorSource,
        //样式设置
        style: this.styleFunction
      })
      //将矢量图层加载到地图中
      this.map.addLayer(this.vectorLayer)
      //获取地图视图
      const view = this.map.getView()
      //平移地图
      // view.setCenter([12536865.056410152, 3635008.742201894])
      view.setCenter(olProj.fromLonLat([121.4664, 31.2355]))
      //地图缩放
      view.setZoom(9)
    },

    styleFunction (feature, resolution) {
      /**
       *矢量几何要素的样式
       */
      const image = new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({ color: 'red', width: 1 })
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
  }
}
</script>

<!--<style type='text/css' scoped>-->
<style lang="less" scoped>
.container{
  position: relative;
  //top: 0;
  //left: 0;
  width: 100%;
  height: 100%;
}
.TopBar{
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
.MapMenu{
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
.mapmenu-button{
  margin-right: 1em;
  width: 19em;
  display: inline-block;
}
.mapmenu-label {
  font-weight: bold;
  transition: color 0.25s;
}
.mapmenu-icon{
  font-size: 15px;
  color: #595959;
  padding: 0.25em;
  margin: 0 1em;
  border: 2px solid #595959;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}
.mapmenu-item{
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
.layerControl {
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

.layerControl .title {
  font-weight: bold;
  font-size: 15px;
  margin: 10px;
}

.layerTree li {
  list-style: none;
  margin: 5px 10px;
}
</style>
