<template>
  <div>
    <div class="header">
      <span class="search-header">{{ title }}</span>
      <svg t="1654404402482" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2677" width="16" height="16"><path d="M480 437.344h64v309.312h-64v-245.312h-64v-64h64zM512 288a53.344 53.344 0 1 1 0 106.656A53.344 53.344 0 0 1 512 288z m0-224c246.4 0 448 201.6 448 448s-201.6 448-448 448S64 758.4 64 512 265.6 64 512 64z m0 69.824C304.16 133.824 133.824 304.16 133.824 512c0 207.84 170.336 378.176 378.176 378.176 207.84 0 378.176-170.336 378.176-378.176 0-207.84-170.336-378.176-378.176-378.176z" p-id="2678"></path></svg>
    </div>
    <div class="main">
      <span class="main-title">{{ total }}</span>
      <span class="main-content">{{ rate }}</span>
      <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
        <path v-if="rise" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
        <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
      </svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'LineCharts',
  props: ['title', 'total', 'rate', 'rise'],
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [60, 70, 55, 106, 58, 75, 90, 50, 120, 130],
          smooth: true,
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'cornflowerblue'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'cornflowerblue' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  color: slategray;
}
.search-header {
  margin-right: 10px
}
.main {
  margin: 10px 0px;
}
.main-title {
  margin-right: 30px;
  font-size: 20px;

}
.main-content {
  margin-right: 10px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
