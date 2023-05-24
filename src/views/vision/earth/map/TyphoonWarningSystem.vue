<template>
  <div class="typhoon">
    <el-button class="button" type="primary" @click="createTyphoon">
      <span v-if="hasTyphoon">点击清除台风</span>
      <span v-else>随机生成台风</span>
    </el-button>
    <label class="date" v-if="dateFlag">当前时间: {{ typhoonNow[0].time }}</label>
    <label class="date" v-else>当前时间: {{ date }}</label>
    <div class="chart" ref="echartRef"></div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, computed, watch} from "vue";
import * as echarts from 'echarts'
import { ElNotification } from 'element-plus'
import mapData from './south.json'
import cityData from './city.json'
import chartInit from './chartInit' //初始化的option
import queen from './queen' //台风算法集

// import 'echarts/map/js/province/guangdong.js' //同步写法

const echartRef = ref()
const chart = ref()
const waringMap = ref()
const waringMapCur = ref()

const typhoonNow = ref()
const hasTyphoon = ref(false)
const date = new Date().toLocaleDateString()
const dateFlag = ref(false)
const typhoonHandle = ref()

const typhoon = computed(() => {
  //  在南海或东海随机生成一个台风
  let Typhoon = queen.setTyphoon()
  let description = `${Typhoon[0].strong}级${Typhoon[0].strongStr}【${Typhoon[0].name}】出现在${Typhoon[0].seaArea}`
  let message = `消息: ${Typhoon[0].name}出现!`
  ElNotification.info({
    title: message,
    message: description,
    duration: 7000,
  })
  // ElNotification({
  //   title: message,
  //   message: description,
  // })
  return Typhoon
})
const computWaring = computed(() => {
  //根据台风位置和城市位置计算预警值
  let waringMapNew = queen.computWaring(waringMapCur.value, typhoonNow.value)
  return waringMapNew
})
watch(() => typhoonNow,
    val => {
      //台风实时监测
      let computwaringMap = computWaring
      let waringMapNew = computwaringMap.waringMapNew //最新预警值
      let landing = computwaringMap.landing //是否登陆
      let gameover = val[0].gameover //是否消失
      if (hasTyphoon.value) {
        dateFlag.value = true //台风出现,右上角显示日期
        if (landing) {
          //登陆信号由城市发出
          val[0].landing = true //设置台风登陆,触发削弱函数
          let description = `${val[0].strongStr}【${val[0].name}】已登陆,登陆点为${landing.name}<br/>东经:${landing.geoCoord[0]} , 北纬:${landing.geoCoord[1]}`
          let message = `警报: ${val[0].name}已登陆!`
          ElNotification.warning({
            title: message,
            message: description,
            duration: 7000,
          })
        }
        if (gameover) {
          let description = `台风【${val[0].name}】已削弱为无足轻重`
          let message = `警报解除: ${val[0].name}已消亡!`
          this.$notification.info({
            message,
            description,
          })
          cleanTyphoon()
          hasTyphoon.value = false
        } else {
          chart.value.setOption({
            series: [
              {
                name: 'typhoon',
                data: val,
              },
              {
                name: '预警等级',
                data: waringMapNew,
              },
            ],
          })
        }

        if (val[0].ifStronger == '增强') {
          let description = `【${val[0].name}】已增强为${val[0].strong}级${val[0].strongStr}`
          let message = `警报: ${val[0].name}已增强!`
          ElNotification.warning({
            title: message,
            message: description,
          })
        } else if (val[0].ifStronger == '削弱') {
          let description = `【${val[0].name}】已削弱为${val[0].strong}级${val[0].strongStr}`
          let message = `喜讯: ${val[0].name}已削弱!`
          ElNotification.success({
            title: message,
            message: description,
            duration: 7000,
          })
        }
      }
    },
    {}
)

const initMap = () => {
  chart.value = echarts.init(echartRef.value)
  // console.log('chart.value', chart.value)
  window.onresize = chart.value.resize
  // console.log('mapData', mapData)
  echarts.registerMap('自制两广地图', mapData);
  let cityDetail: any[] = cityData.cityDetail //获得geo
  let waring = cityData.waringInit //获得地名与waring
  let southMap: any[] = []
  for (let i = 0; i < cityDetail.length; i++) {
    if (cityDetail[i].name == "广东省" || cityDetail[i].name == "广西壮族自治区") {
      southMap = southMap.concat(cityDetail[i].children)
    }
  }
  // console.log(cityDetail,southMap);
  //闭包初始化waringMap
  let waringMap = ((waring) => {
    let waringArr: any[] = []
    let len = waring.length
    while (len--) {
      let cityName = waring[len]
      let geoCoord: any[] = []
      let i
      for (i = 0; i < southMap.length; i++) {
        if (southMap[i].name == cityName) {
          geoCoord.push(southMap[i].log)
          geoCoord.push(southMap[i].lat)
        }
      }
      if (i == southMap.length) {
        geoCoord.push('暂无数据') //未收录坐标
      }
      waringArr.push({
        name: cityName + '市',
        value: 0,
        geoCoord
      })
    }
    return waringArr
  })(waring)
  // commit('setWaring', waringMap) //调用mutations
  setWaring(waringMap)

  chart.value.setOption(chartInit)
  chart.value.setOption({
    series: [{
      name: '预警等级', // 浮动框的标题
      type: 'map',
      geoIndex: 0,
      data: waringMap
    }, {
      name: 'typhoon'
    }]
  });
  chart.value.resize()
}

const setWaring = (waringMap) => {
  waringMap.value = waringMap
  waringMapCur.value = waringMap
}

const updateTyphoon = (typhoon, flag) => {
  // commit('setTyphoonHandle',true) 此处使用while(typhoonHandle)会卡死,故折中使用flag
  if (flag) { //flag用于控制时间
    typhoonHandle.value = setInterval(() => {
      let typhoonNow = queen.setTyphoonPath(typhoon[0])
      typhoonNow.value = typhoonNow
    }, 2000)
  } else {
    clearInterval(typhoonHandle.value)
  }
}
const createTyphoon = () => {
  hasTyphoon.value = !hasTyphoon.value
  if (hasTyphoon.value) {
    //生成台风
    chart.value.setOption({
      series: [
        {
          name: 'typhoon',
          data: typhoon.value,
        },
      ],
    })
    //mapActions函数,用于推送typhoon状态
    updateTyphoon(typhoon.value, true)  //flag用于控制setInterval的时间
  } else {
    cleanTyphoon()
  }
}

const cleanTyphoon = () => {
  chart.value.setOption({
    series: [
      {
        name: 'typhoon',
        data: [],
      },
      {
        name: '预警等级',
        data: waringMap.value,
      },
    ],
  })
  updateTyphoon([], false)
  dateFlag.value = false
}


onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  chart.value.dispose()
  chart.value = null

})
</script>
<style lang="scss">
.typhoon {
  position: relative;

  .button {
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 10px;
  }

  .date {
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 150px;
    background-color: #2d8ce0;
    border-color: #2d8cf0;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-family: 'microsoft yahei';
  }

  .chart {
    top: 50px;
    height: 600px;
    width: 100%;
  }
}
</style>