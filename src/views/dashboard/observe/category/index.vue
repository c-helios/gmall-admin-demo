<template>
  <el-card class="box-card">
    <div slot="header" class="category-header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="tabPosition">
        <!-- <el-radio-button label="全部渠道" /> -->
        <el-radio-button label="online">线上</el-radio-button>
        <el-radio-button label="shop">门店</el-radio-button>
      </el-radio-group>
    </div>
    <div ref="charts" class="charts" />
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Category',
  props: ['saleRank'],
  data() {
    return {
      tabPosition: 'online',
      charts: null
    }
  },
  computed: {
    dataList() {
      const data = this.tabPosition === 'online' ? this.saleRank && this.saleRank.online : this.saleRank && this.saleRank.shop
      const dataList = []
      if (data && data.name) {
        for (let index = 0; index < data.name.length; index++) {
          const name = data.name[index]
          const value = data.value[index]
          dataList.push({ name, value })
        }
      }
      return dataList
    }
  },
  watch: {
    tabPosition() {
      this.echartsSetOption(this.dataList)
    },
    saleRank() {
      this.echartsSetOption(this.dataList)
    }
  },
  mounted() {
    this.charts = echarts.init(this.$refs.charts)
    this.echartsSetOption(this.dataList)
    this.charts.on('mouseover', (params) => {
      const { name, value } = params.data
      this.charts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  },
  methods: {
    echartsSetOption(dataList) {
      this.charts.setOption({
        title: {
          text: '',
          subtext: '',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside'
            },
            labelLine: {
              show: true
            },
            data: dataList
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
