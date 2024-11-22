<script setup>
import NavVue from "@/components/Nav.vue"
import SearchVue from "@/components/Search.vue"
import VChart from 'vue-echarts';
import {getOnlineUserCount, getOnlineUserTime, refreshPubgOnline, getOnlineUserFirst} from '@/util/refreshPubgOnline.js'
import {onBeforeUnmount, onMounted, ref} from "vue";

const count = ref()
const time = ref()
const online = ref()
onMounted(async () => {
  await refreshPubgOnline()
  updateChart()
  online.value = getOnlineUserFirst()
  window.addEventListener('resize', updateGridOnResize);
  updateGridOnResize();  // 初始化时根据当前屏幕宽度调整grid
})

const chartOption = ref({
  tooltip: {
    trigger: 'axis', // 触发方式：'axis' 表示在坐标轴上触发，'item' 表示在单个数据项上触发
    axisPointer: {type: 'shadow'}, // 指示器样式
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      show: true,
      formatter: '{value}', // 格式化标签
      rotate: 0, // 设置旋转角度，避免标签重叠
    },
    minInterval: 1,  // 确保显示最小单位
  },
  series: [
    {
      name: 'Sales',
      data: [],
      type: 'bar'
    }
  ],
  dataZoom: [
    {
      type: 'slider',  // 使用滑动条
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100,
    },
  ],
});

const updateChart = () => {
  count.value = getOnlineUserCount().reverse()
  time.value = getOnlineUserTime().reverse()
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: time.value, // 使用 ref 中的数据
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true,
        formatter: '{value}', // 格式化标签
        rotate: 0, // 设置旋转角度，避免标签重叠
      },
      minInterval: 1,  // 确保显示最小单位
    },
    series: [
      {
        name: '在线人数统计',
        type: 'bar',
        data: count.value, // 使用 ref 中的数据
        itemStyle: {
          barBorderRadius: 10
        }
      },
    ],
    dataZoom: [
      {
        type: 'slider',  // 使用滑动条
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
  }
}
const updateGridOnResize = () => {
  // 获取窗口的宽度，来决定grid的左边距
  const windowWidth = window.innerWidth;

  // 设置不同屏幕宽度下的 grid 配置
  if (windowWidth < 768) {
    chartOption.value.grid.left = '15%';  // 屏幕小于768px时调整左边距
    chartOption.value.grid.right = '5%';  // 屏幕小于768px时调整右边距
  } else {
    chartOption.value.grid.left = '10%';  // 屏幕大于768px时恢复默认设置
    chartOption.value.grid.right = '10%';  // 屏幕小于768px时调整右边距
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGridOnResize);
});
</script>

<template>
  <NavVue></NavVue>
  <SearchVue :showOnline="true" :onlineUsers="online"></SearchVue>
  <div class="chart_div">
    <v-chart :option="chartOption" style="width: 100%; height: 500px;"/>
  </div>

</template>

<style scoped>
.chart_div {
  position: relative;
  width: 90%;
  background-color: rgb(248 248 248);
  box-shadow: 0 0 3px #0003;
  border-radius: 10px;
  margin: -100px auto;
  z-index: 999 !important;
}

</style>
