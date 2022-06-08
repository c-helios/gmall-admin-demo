<template>
  <div ref="charts" class="charts" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ProgressCharts',
  props: ['list'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    list() {
      this.echartsSetOption(this.list)
    }
  },
  mounted() {
    this.lineCharts = echarts.init(this.$refs.charts)
  },
  methods: {
    echartsSetOption(data) {
      this.lineCharts.setOption({
        xAxis: {
          show: false,
          min: 0,
          max: 100
        },
        yAxis: {
          show: false,
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            data: data,
            barWidth: 10,
            color: '#32CD32',
            showBackground: true,
            backgroundStyle: {
              color: '#eee'
            },
            label: {
              show: true,
              formatter: '｜',
              position: 'right'
            }
          }
        ],
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        tooltip: {}
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
