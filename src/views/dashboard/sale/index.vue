<template>
  <el-card class="box-card" style="margin:10px 0px">
    <div class="clearfix">
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale">
          <!-- <div ref="saleCharts" /> -->
        </el-tab-pane>
        <el-tab-pane label="访问量" name="visit">
          <div ref="visitCharts" />
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="right"> -->
      <ul class="right">
        <li><a @click="setDay">今日</a></li>
        <li><a @click="setWeek">本周</a></li>
        <li><a @click="setMonth">本月</a></li>
        <li><a @click="setYear">本年</a></li>
        <li>
          <el-date-picker
            v-model="searchDate"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          />
        </li>
      </ul>
      <!-- </div> -->
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="boxCharts" class="boxCharts" />
        </el-col>
        <el-col :span="6" class="ranking">
          <h3>门店{{ title }}排名</h3>
          <ol>
            <li v-for="rank in rankList" :key="rank.no">
              <span>{{ rank.name }}</span>
              <span class="count">{{ rank.money }}</span>
            </li>
          </ol>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      boxCharts: null,
      searchDate: []
    }
  },
  computed: {
    isSale() {
      return this.activeName === 'sale'
    },
    title() {
      return this.isSale ? '销售额' : '访问量'
    },
    ...mapState({
      homeInfo: state => state.home.homeInfo
    }),
    rankList() {
      return this.isSale ? this.homeInfo.orderRank : this.homeInfo.userRank
    }
  },
  watch: {
    title() {
      const xAxisData = this.isSale ? this.homeInfo.orderFullYearAxis : this.homeInfo.userFullYearAxis
      const seriesData = this.isSale ? this.homeInfo.orderFullYear : this.homeInfo.userFullYear
      const seriesColor = this.isSale ? '#33CCFF' : '#00DDAA'
      this.echartsSetOption(xAxisData, seriesData, seriesColor)
    },
    homeInfo() {
      this.echartsSetOption(this.homeInfo.orderFullYearAxis, this.homeInfo.orderFullYear, '#33CCFF')
    }
  },
  mounted() {
    this.boxCharts = echarts.init(this.$refs.boxCharts)
    this.echartsSetOption([], [], '#33CCFF')
  },
  methods: {
    echartsSetOption(xAxisData, seriesData, seriesColor) {
      this.boxCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.title,
            type: 'bar',
            barWidth: '70%',
            data: seriesData,
            color: seriesColor
          }
        ]
      })
    },
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.searchDate = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.searchDate = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.searchDate = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.searchDate = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 240px;
}
.clearfix ul {
  list-style: none;
  margin: 0px;
}
.clearfix ul li {
  display: inline;
  margin: 0px 10px;
}
.boxCharts {
  width: 100%;
  height: 300px;
}
.ranking ol {
  list-style-type: none;
  margin: 0;
  counter-reset: ranking-list-counter;
  position: relative;
}
.ranking ol li::before {
  color: black;
  border-radius: 50%;
  content: counter(ranking-list-counter);
  counter-increment: ranking-list-counter;
  height:20px;
  left: 0;
  line-height:22px;
  position: absolute;
  text-align: center;
  /* margin: 10px 0px; */
  width:20px;
}
.ranking ol li:nth-child(-n+3)::before {
  background: black;
  color: white;
}
.ranking ol li {
  margin: 20px 0px;
}
.ranking ol li span {
  padding: 0px 10px;
}
.ranking .count {
  float: right;
}
</style>
