<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        {{ spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格（元）" />
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input v-model="skuInfo.weight" placeholder="重量（千克）" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="attrInfo in attrInfoList" :key="attrInfo.id" :label="attrInfo.attrName" style="margin:5px">
            <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          :data="spuImageList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55" />
          <el-table-column
            label="图片"
            width="120">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:80px;height:80px">
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
          />
          <el-table-column
            label="操作">
            <template slot-scope="{row}">
              <el-tag
                v-if="row.isDefault == '1'"
                :disable-transitions="true"
              >
                设为默认
              </el-tag>
              <el-button v-else type="primary" size="small" @click="changeDefaultImg(row)">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="canncelSkuInfo">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuName: '',
      skuInfo: {
        category3Id: 0,
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
        tmId: 0,
        spuId: 0,
        isSale: 0,
        skuDefaultImg: ''
      },
      attrInfoList: [],
      spuSaleAttrList: [],
      spuImageList: [],
      selectImageList: []
    }
  },
  methods: {
    initData(category1Id, category2Id, spu) {
      this.spuName = spu.spuName
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 平台属性
      this.$Api.attr.getAttrInfoList(category1Id, category2Id, spu.category3Id).then(response => {
        this.attrInfoList = response.data
      }).catch(_ => {
        this.attrInfoList = []
      })
      // 销售属性
      this.$Api.sku.getSpuSaleAttrList(spu.id).then(response => {
        this.spuSaleAttrList = response.data
      }).catch(_ => {
        this.spuSaleAttrList = []
      })
      // 图片列表
      this.$Api.sku.getSpuImageList(spu.id).then(response => {
        this.spuImageList = response.data
      }).catch(_ => {
        this.spuImageList = []
      })
    },
    handleSelectionChange(params) {
      this.selectImageList = params
    },
    changeDefaultImg(row) {
      this.spuImageList.forEach(item => {
        if (!item.isDefault) {
          this.$set(item, 'isDefault', '0')
        } else {
          item.isDefault = '0'
        }
      })
      row.isDefault = '1'
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    saveSkuInfo() {
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          pre.push({ attrId: Number(attrId), valueId: Number(valueId) })
        }
        return pre
      }, [])
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce((pre, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          pre.push({ saleAttrId: Number(saleAttrId), saleAttrValueId: Number(saleAttrValueId) })
        }
        return pre
      }, [])
      this.skuInfo.skuImageList = this.selectImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault
        }
      })
      this.$Api.sku.saveSkuInfo(this.skuInfo).then(_ => {
        this.$message.success('保存成功')
        this.$emit('closeSkuForm', 0)
        Object.assign(this._data, this.$options.data())
      })
    },
    canncelSkuInfo() {
      this.$emit('closeSkuForm', 0)
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>

</style>
