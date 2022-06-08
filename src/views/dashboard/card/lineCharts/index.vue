<template>
  <div ref="charts" class="charts" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineCharts',
  props: ['list'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    list() {
      this.echartSetOption(this.list)
    }
  },
  mounted() {
    this.lineCharts = echarts.init(this.$refs.charts)
  },
  methods: {
    echartSetOption(data) {
      this.lineCharts.setOption({
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
            data: data,
            smooth: true,
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: '#B088FF'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#D1BBFF' // 0% 处的颜色
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
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}

</style>
