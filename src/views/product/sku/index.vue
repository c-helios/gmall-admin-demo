<template>
  <div v-loading="loading">
    <el-table :data="dataList" border>
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="skuName" label="名称" header-align="center" />
      <el-table-column prop="skuDesc" label="描述" header-align="center" />
      <el-table-column label="默认图片" width="120" header-align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量（KG）" width="120" header-align="center" />
      <el-table-column prop="price" label="价格（元）" width="120" header-align="center" />
      <el-table-column label="操作" header-align="center">
        <template slot-scope="{row}">
          <hint-button v-show="row.isSale == 1" type="success" icon="el-icon-bottom" title="下架" size="mini" @click="cancelSale(row.id)" />
          <hint-button v-show="row.isSale == 0" type="info" icon="el-icon-top" title="上架" size="mini" @click="onSale(row.id)" />
          <hint-button type="primary" icon="el-icon-edit" title="编辑" size="mini" @click="toEdit(row)" />
          <hint-button type="info" icon="el-icon-info" title="查看" size="mini" @click="toView(row.id)" />
          <el-popconfirm :title="`确定将${row.skuName}删除吗？`" @onConfirm="handleDelete(row.id)">
            <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      :current-page="pageNo"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      align="center"
      @size-change="handleSizeChange"
      @current-change="getSkuDataList"
    />

    <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5" class="col-span-title">名称</el-col>
        <el-col :span="16" class="col-span-content">{{ viewSkuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="col-span-title">描述</el-col>
        <el-col :span="16" class="col-span-content">{{ viewSkuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="col-span-title">价格</el-col>
        <el-col :span="16" class="col-span-content">{{ viewSkuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="col-span-title">平台属性</el-col>
        <el-col :span="16" class="col-span-content">
          <el-tag v-for="attr in viewSkuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin:5px">{{ attr.valueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="col-span-title">商品图片</el-col>
        <el-col :span="16" class="col-span-content">
          <el-carousel :interval="5000" arrow="always" height="500px" style="width:500px;">
            <el-carousel-item v-for="item in viewSkuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      pageNo: 1,
      pageSize: 20,
      total: 0,
      dataList: [],
      drawer: false,
      viewSkuInfo: {},
      loading: true
    }
  },
  mounted() {
    this.getSkuDataList()
  },
  methods: {
    getSkuDataList(pageNo = 1) {
      this.pageNo = pageNo
      this.loading = true
      this.$Api.sku.getProductList(this.pageNo, this.pageSize).then(resp => {
        this.dataList = resp.data.records
        this.total = resp.data.total
        this.loading = false
      }).catch(_ => {
        this.dataList = []
        this.total = 0
        this.loading = false
      })
    },
    onSale(id) {
      this.$Api.sku.onSale(id).then(resp => {
        this.$message.success('上架成功')
        this.getSkuDataList(this.pageNo)
      })
    },
    cancelSale(id) {
      this.$Api.sku.cancelSale(id).then(resp => {
        this.$message.success('下架成功')
        this.getSkuDataList(this.pageNo)
      })
    },
    toEdit(skuInfo) {
      this.$message('正在紧锣密鼓的开发中...')
    },
    toView(id) {
      this.drawer = true
      this.$Api.sku.getSkuById(id).then(resp => {
        this.viewSkuInfo = resp.data
      }).catch(_ => {
        this.viewSkuInfo = []
      })
    },
    handleDelete(id) {
      if (!id) {
        return
      }
      this.$Api.sku.deleteSku(id).then(resp => {
        this.pageNo = this.dataList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
        this.getSkuDataList(this.pageNo > 0 ? this.pageNo : 1)
        this.$message.success('删除成功')
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSkuDataList()
    }
  }
}
</script>

<style scoped>
/**
 * css 深度选择器 (当style为scope时，子组件想要使用到父组件的css样式时，可以使用深度选择器)
 *  1、原生    >>>
 *  2、less   /deep/
 *  3、scss   ::v-deep
 */
>>>.el-row .col-span-title {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  line-height: 40px;
}
>>>.el-row .col-span-content {
  line-height: 40px;
  margin-left: 20px;
}
>>>.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

>>>.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

>>>.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
>>>.el-carousel__button {
  width: 15px;
  height: 15px;
  background-color: red;
  border-radius: 50%;
}
</style>
