<template>
  <el-form ref="spuInfo" :model="spuInfo" label-width="80px">
    <el-form-item label="SPU名称" prop="spuName">
      <el-input v-model="spuInfo.spuName" placeholder="SPU名称" />
    </el-form-item>
    <el-form-item label="品牌" prop="tmId">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option
          v-for="tm in tradeMarkList"
          :key="tm.id"
          :label="tm.tmName"
          :value="tm.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述" prop="description">
      <el-input v-model="spuInfo.description" type="textarea" placeholder="SPU描述" rows="4" />
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="selectSaleAttr" :disabled="unSelectSaleAttr.length < 1" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.baseSaleAttrId"
          :label="item.saleAttrName"
          :value="item"
        />
      </el-select>
      <el-button :disabled="!selectSaleAttr" type="primary" icon="el-icon-plus" style="margin:0px 10px" @click="addSaleAttr">添加销售属性</el-button>
      <el-table :data="spuInfo.spuSaleAttrList" style="margin:10px 0px" border>
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="saleAttrName" label="属性名" />
        <el-table-column label="属性值列表">
          <template slot-scope="{row}">
            <span v-for="(attrValue,index) in row.spuSaleAttrValueList" :key="attrValue.id" style="margin:5px">
              <el-input
                v-if="attrValue.tagInputVisible"
                ref="updateTagInput"
                v-model="attrValue.saleAttrValueName"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleTagInputConfirm(attrValue)"
                @blur="handleTagInputConfirm(attrValue)"
              />
              <el-tag
                v-else
                closable
                :disable-transitions="true"
                @close="handleClose(row, index)"
                @click="showTagInput(attrValue)"
              >
                {{ attrValue.saleAttrValueName }}
              </el-tag>
            </span>
            <el-input
              v-if="row.inputVisible"
              ref="saveTagInput"
              v-model="row.inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
            <el-popconfirm :title="`确定将属性${row.saleAttrName}删除吗？`" @onConfirm="handleSaleAttrDelete($index)">
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                style="margin:0px 5px"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveOrUpdateSpuInfo">保存</el-button>
      <el-button @click="cancelSpuInfo">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',
  props: ['category3id'],
  data() {
    return {
      spuInfo: {
        id: '',
        category3Id: this.category3id,
        spuName: '',
        tmId: '',
        description: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      tradeMarkList: [],
      spuImageList: [],
      spuSaleAttrList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      selectSaleAttr: undefined
    }
  },
  computed: {
    unSelectSaleAttr() {
      return this.spuSaleAttrList.filter(item => {
        return this.spuInfo.spuSaleAttrList.every(item1 => item.baseSaleAttrId !== item1.baseSaleAttrId)
      })
    }
  },
  methods: {
    initData(spu) {
      // 品牌
      this.$Api.tradeMark.getTrademarkList().then(response => {
        this.tradeMarkList = response.data
      }).catch(() => {
        this.tradeMarkList = []
      })
      // 销售属性
      this.$Api.spu.getBaseSaleAttrList().then(response => {
        this.spuSaleAttrList = response.data.map(item => {
          return {
            baseSaleAttrId: item.id,
            saleAttrName: item.name
          }
        })
      }).catch(() => {
        this.spuSaleAttrList = []
      })
      if (spu) {
        // SPU信息
        this.$Api.spu.getSpuById(spu.id).then(response => {
          this.spuInfo = response.data
        }).catch(() => {
          this.spuInfo = {}
        })
        // SPU图片
        this.$Api.sku.getSpuImageList(spu.id).then(response => {
          this.spuInfo.spuImageList = response.data
          const imageList = response.data
          imageList.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl
          })
          this.spuImageList = imageList
        }).catch(() => {
          this.spuInfo.spuImageList = []
        })
      }
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    saveOrUpdateSpuInfo() {
      this.spuInfo.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      this.spuInfo.category3Id = this.category3id
      this.$Api.spu.saveOrUpdateSpuInfo(this.spuInfo).then(response => {
        this.$message.success('保存成功')
        this.resetForm()
        this.$emit('closeSpuForm', 0, true, !this.spuInfo.id)
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },
    cancelSpuInfo() {
      this.resetForm()
      this.$emit('closeSpuForm', 0, false, false)
    },
    resetForm() {
      // this.spuInfo.id = ''
      // this.spuInfo.category3Id = ''
      // this.spuInfo.spuImageList = []
      // this.spuInfo.spuSaleAttrList = []
      // this.spuImageList = []
      // this.spuSaleAttrList = []
      // this.$refs.spuInfo.resetFields()
      // this.selectSaleAttr = undefined
      // 清理数据
      Object.assign(this._data, this.$options.data())
    },
    handleSaleAttrDelete(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1)
    },
    addSaleAttr() {
      const baseSaleAttrId = this.selectSaleAttr.baseSaleAttrId
      const saleAttrName = this.selectSaleAttr.saleAttrName
      this.spuInfo.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] })
      this.selectSaleAttr = undefined
    },
    showTagInput(attrValue) {
      this.$set(attrValue, 'tagInputVisible', true)
      this.$nextTick(_ => {
        this.$refs['updateTagInput'][0].$refs.input.focus()
      })
    },
    handleTagInputConfirm(attrValue) {
      // 防止重复调用，当输入完毕回车时，失去焦点和回车会同时调用两次
      if (!attrValue.tagInputVisible) {
        return
      }
      const saleAttrValueName = attrValue.saleAttrValueName
      if (!saleAttrValueName || saleAttrValueName.trim() === '') {
        this.$message('请输入正确的属性值')
        return
      }
      attrValue.tagInputVisible = false
    },
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(_ => {
        this.$refs['saveTagInput'].$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      // 防止重复调用，当输入完毕回车时，失去焦点和回车会同时调用两次
      if (!row.inputVisible) {
        return
      }
      const baseSaleAttrId = row.baseSaleAttrId
      let inputValue = row.inputValue
      if (!inputValue || inputValue.trim() === '') {
        this.$message('请输入正确的属性值')
        return
      }
      inputValue = inputValue.trim()
      if (row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)) {
        row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })
      }
      row.inputVisible = false
      row.inputValue = ''
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    margin-top: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-top: 10px;
    vertical-align: bottom;
  }
</style>
