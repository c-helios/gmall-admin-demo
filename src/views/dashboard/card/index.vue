<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count-text="`¥ ${salesTotal}`">
            <template slot="charts">
              <p>
                周同比 {{ convertValue(activityGrowthLastMonth) }}%
                <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
                  <path v-if="isRise(activityGrowthLastMonth)" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
                  <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
                </svg>
                日同比 {{ convertValue(activityGrowthLastDay) }}%
                <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
                  <path v-if="isRise(activityGrowthLastDay)" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
                  <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
                </svg>
              </p>
            </template>
            <template slot="footer">
              日销售额¥ {{ salesToday }}
              <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
                <path v-if="isRise(salesToday)" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
                <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
              </svg>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count-text="visitTotal">
            <template slot="charts">
              <LineCharts :list="visitTrend" />
            </template>
            <template slot="footer">
              日访问量 {{ visitToday }}
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" :count-text="payTotal">
            <template slot="charts">
              <BarCharts :list="payTrend" />
            </template>
            <template slot="footer">
              转化率 {{ payRate }}%
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count-text="`${activityRate}%`">
            <template slot="charts">
              <ProgressCharts :list="[activityRate]" />
            </template>
            <template slot="footer">
              周同比 {{ convertValue(activityGrowthLastMonth) }}%
              <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
                <path v-if="isRise(activityGrowthLastMonth)" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
                <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
              </svg>
              日同比 {{ convertValue(activityGrowthLastDay) }}%
              <svg class="icon" viewBox="0 0 1024 1024" width="10" height="10">
                <path v-if="isRise(activityGrowthLastDay)" d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="3501" fill="#d81e06" />
                <path v-else d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4399" fill="#1afa29" />
              </svg>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './detail'
import LineCharts from './lineCharts'
import BarCharts from './barCharts'
import ProgressCharts from './progressCharts'
import { mapState } from 'vuex'

export default {
  name: 'Card',
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts
  },
  computed: {
    ...mapState({
      homeInfo: state => state.home.homeInfo,
      salesTotal: state => state.home.homeInfo.salesTotal,
      salesToday: state => state.home.homeInfo.salesToday,
      visitTotal: state => state.home.homeInfo.visitTotal,
      visitToday: state => state.home.homeInfo.visitToday,
      visitTrend: state => state.home.homeInfo.visitTrend,
      payTotal: state => state.home.homeInfo.payTotal,
      payRate: state => state.home.homeInfo.payRate,
      payTrend: state => state.home.homeInfo.payTrend,
      activityRate: state => state.home.homeInfo.activityRate,
      activityGrowthLastMonth: state => state.home.homeInfo.activityGrowthLastMonth,
      activityGrowthLastDay: state => state.home.homeInfo.activityGrowthLastDay

    })
  }, methods: {
    isRise(value) {
      return value > 0
    },
    convertValue(value) {
      return this.isRise(value) ? value : value * -1
    }
  }

}
</script>

<style>

</style>
