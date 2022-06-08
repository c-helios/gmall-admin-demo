<template>
  <div ref="charts" class="charts" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'BarCharts',
  props: ['list'],
  data() {
    return {
      barCharts: null
    }
  },
  watch: {
    list() {
      this.echartsSetOption(this.list)
    }
  },
  mounted() {
    this.barCharts = echarts.init(this.$refs.charts)
  },
  methods: {
    echartsSetOption(data) {
      this.barCharts.setOption({
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          show: false
        },
        series: [
          {
            type: 'bar',
            data: data,
            color: '#5470c6'
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
