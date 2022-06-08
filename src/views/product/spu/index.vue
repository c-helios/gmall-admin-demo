<template>
  <div v-loading="spuLoading">
    <el-card>
      <CategorySelect :disabled-category-select="scene != 0" @getSelectedCategoryId="getSelectedCategoryId" />
    </el-card>
    <el-card style="margin:20px 0px">
      <div v-show="scene == 0">
        <el-button :disabled="!category3Id" type="primary" icon="el-icon-plus" @click="toAddSpu">添加SPU</el-button>
        <el-table :data="spuList" style="margin:20px 0px" border>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="spuName" label="SPU名称" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <hint-button type="primary" icon="el-icon-plus" size="mini" title="添加sku" @click="toAddSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="编辑spu" @click="toEditSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="toViewSkuBySpu(row)" />
              <el-popconfirm :title="`确定将${row.spuName}删除吗？`" @onConfirm="handleSpuDelete(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
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
          @current-change="getSpuDataList"
        />
      </div>
      <SpuForm v-show="scene == 1" ref="spuForm" :category3id="category3Id" @closeSpuForm="closeSpuForm" />
      <SkuForm v-show="scene == 2" ref="skuForm" :category3id="category3Id" @closeSkuForm="closeSkuForm" />
      <el-dialog :title="`${selectSpu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeSkuDialog">
        <el-table v-loading="loading" :data="selectSpuSkuList">
          <el-table-column prop="skuName" label="名称" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="weight" label="重量" />
          <el-table-column label="默认图片">
            <template slot-scope="{row}">
              <img :src="row.skuDefaultImg" style="width:80px;heigth:80px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './spuForm'
import SkuForm from './skuForm'

export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      scene: 0,
      spuList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      dialogTableVisible: false,
      selectSpu: {},
      selectSpuSkuList: [],
      loading: true,
      spuLoading: false
    }
  },
  methods: {
    getSelectedCategoryId(categoryId, categoryLevel) {
      this.total = 0
      if (categoryLevel === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (categoryLevel === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (categoryLevel === 3) {
        this.category3Id = categoryId
        this.scene = 0
        this.getSpuDataList()
      }
    },
    getSpuDataList(pageNo = 1) {
      this.pageNo = pageNo
      const params = {
        category3Id: this.category3Id
      }
      this.spuLoading = true
      this.$Api.spu.getProductPageList(params, this.pageNo, this.pageSize).then(response => {
        this.spuList = response.data.records
        this.total = response.data.total
        this.spuLoading = false
      }).catch(() => {
        this.spuList = []
        this.spuLoading = false
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSpuDataList()
    },
    toAddSku(spuInfo) {
      this.scene = 2
      this.$refs.skuForm.initData(this.category1Id, this.category2Id, spuInfo)
    },
    toAddSpu() {
      this.scene = 1
      this.$refs.spuForm.initData()
    },
    toEditSpu(spuInfo) {
      this.scene = 1
      this.$refs.spuForm.initData(spuInfo)
    },
    toViewSkuBySpu(spuInfo) {
      this.dialogTableVisible = true
      this.selectSpu = spuInfo
      this.$Api.sku.findBySpuId(spuInfo.id).then(response => {
        this.selectSpuSkuList = response.data
        this.loading = false
      }).catch(_ => {
        this.selectSpuSkuList = []
      })
    },
    closeSkuDialog(done) {
      this.loading = true
      this.selectSpuSkuList = []
      done()
    },
    handleSpuDelete(spuInfo) {
      this.$Api.spu.deleteSpu(spuInfo.id).then(_ => {
        this.$message.success('删除成功')
        this.pageNo = this.spuList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
        this.getSpuDataList(this.pageNo > 0 ? this.pageNo : 1)
      }).catch(_ => {
        this.$message.error('删除失败')
      })
    },
    closeSpuForm(scene, isReloadData, isFirstPage) {
      this.scene = scene
      if (isReloadData) {
        if (isFirstPage) {
          this.getSpuDataList()
        } else {
          this.getSpuDataList(this.pageNo)
        }
      }
    },
    closeSkuForm(scene) {
      this.scene = scene
    }
  }
}
</script>

<style lang="less" scoped>

</style>
