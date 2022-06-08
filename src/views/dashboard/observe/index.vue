<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search :search-word-list="searchWord" :search-word-user-count="searchWordUserCount" :search-word-user-rate="searchWordUserRate" :search-word-avg-count="searchWordAvgCount" :search-word-avg-rate="searchWordAvgRate" />
      </el-col>
      <el-col :span="12">
        <Category :sale-rank="saleRank" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from './category'
import Search from './search'
import { mapState } from 'vuex'

export default {
  name: 'Observe',
  components: {
    Category,
    Search
  },
  computed: {
    ...mapState({
      homeInfo: state => state.home.homeInfo,
      searchWord: state => state.home.homeInfo.searchWord,
      searchWordUserCount: state => state.home.homeInfo.searchWordUserCount,
      searchWordUserRate: state => state.home.homeInfo.searchWordUserRate,
      searchWordAvgCount: state => state.home.homeInfo.searchWordAvgCount,
      searchWordAvgRate: state => state.home.homeInfo.searchWordAvgRate,
      saleRank: state => state.home.homeInfo.saleRank
    })
  }
}
</script>

<style>

</style>
