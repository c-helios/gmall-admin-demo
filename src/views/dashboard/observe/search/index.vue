<template>
  <el-card class="box-card">
    <div slot="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts title="搜索用户数" :total="searchWordUserCount" :rate="searchWordUserRate > 0 ? searchWordUserRate : searchWordUserRate * -1" :rise="searchWordUserRate > 0" />
        </el-col>
        <el-col :span="12">
          <LineCharts title="人均搜索次数" :total="searchWordAvgCount" :rate="searchWordAvgRate > 0 ? searchWordAvgRate : searchWordAvgRate * -1" :rise="searchWordAvgRate > 0" />
        </el-col>
      </el-row>
      <el-table
        :data="pageDataList"
        style="width: 100%"
        :default-sort="{prop: 'user', order: 'descending'}"
        border
      >
        <el-table-column
          type="index"
          label="排名"
          width="80"
        />
        <el-table-column
          prop="word"
          label="搜索关键字"
        />
        <el-table-column
          prop="user"
          label="用户数"
          sortable
        />
        <el-table-column
          prop="count"
          label="周涨幅"
          sortable
        />
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        class="pagination"
        @current-change="getPageList"
      />
    </div>
  </el-card>
</template>

<script>
import LineCharts from './lineCharts'

export default {
  name: 'Search',
  components: {
    LineCharts
  },
  props: ['searchWordList', 'searchWordUserCount', 'searchWordUserRate', 'searchWordAvgCount', 'searchWordAvgRate'],
  data() {
    return {
      pageNo: 1,
      pageSize: 3
    }
  },
  computed: {
    dataList() {
      return this.searchWordList || []
    },
    total() {
      return this.dataList.length
    },
    pageDataList() {
      const list = []
      const start = (this.pageNo - 1) * this.pageSize
      let end = this.pageNo * this.pageSize
      if (start > this.total) {
        return list
      }
      if (end > this.total) {
        end = this.total
      }
      for (let index = start; index < end; index++) {
        list.push(this.dataList[index])
      }
      return list
    }
  },
  methods: {
    getPageList(pageNo) {
      this.pageNo = pageNo
    }
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
  height: 20px;
}
.pagination {
  margin: 10px 0px;
  float: right;
}
</style>
