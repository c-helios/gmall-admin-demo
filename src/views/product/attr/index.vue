<template>
  <div>
    <el-card>
      <CategorySelect :disabled-category-select="disabledCategorySelect" @getSelectedCategoryId="getSelectedCategoryId" />
    </el-card>
    <el-card style="margin:20px 0px">
      <div v-show="!disabledCategorySelect">
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" :disabled="disabledAddAttr" @click="showAddAttrTable">添加属性</el-button>
        <el-table v-loading="loading" :data="attrInfoList" style="width:100%" border>
          <el-table-column type="index" width="80" label="序号" />
          <el-table-column prop="attrName" width="300" label="属性名称" />
          <el-table-column prop="attrValueList" label="属性值列表">
            <template slot-scope="{row}">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" type="success" style="margin:0px 5px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作">
            <template slot-scope="{row}">
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleAttrValueEdit(row)" />
              <el-popconfirm :title="`确定将属性${row.attrName}删除吗？`" @onConfirm="handleAttrDelete(row)">
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  style="margin:0px 5px" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="disabledCategorySelect">
        <el-form style="width:100%">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="" style="width:300px" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="attrInfo.attrName ? false : true" @click="addAttrValueInput">添加属性值</el-button>
        <el-button @click="disabledCategorySelect = false">取消</el-button>
        <el-table :data="attrInfo.attrValueList" style="margin:20px 0px" border>
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="属性值名称">
            <template slot-scope="{row, $index}">
              <el-input v-if="row.isEdit" :ref="$index" v-model="row.valueName" size="mini" @blur="showAttrValueSpan(row, $index)" @keyup.native.enter="showAttrValueSpan(row, $index)" />
              <span v-else style="display:block" @click="showAttrValueInput(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`确定将属性值名称${row.valueName}删除吗？`" @onConfirm="deleteAttrValue(row, $index)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="checkAttrNameAndAttrValue()" @click="saveOrUpdateAttrValue">保存</el-button>
        <el-button @click="disabledCategorySelect = false">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      disabledAddAttr: true,
      disabledCategorySelect: false,
      attrInfoList: [],
      attrInfo: {
        id: '',
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      },
      isRepatAttr: false,
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    getSelectedCategoryId(categoryId, categoryLevel) {
      if (categoryLevel === 1) {
        this.category1Id = categoryId
        this.attrInfoList = []
      } else if (categoryLevel === 2) {
        this.category2Id = categoryId
        this.attrInfoList = []
      } else if (categoryLevel === 3) {
        this.category3Id = categoryId
        this.disabledAddAttr = false
        this.getAttrInfoList()
      }
    },
    getAttrInfoList() {
      this.loading = true
      this.$Api.attr.getAttrInfoList(this.category1Id, this.category2Id, this.category3Id).then(response => {
        this.attrInfoList = response.data
        this.loading = false
      }).catch(error => {
        this.$message.error(error.message)
        this.loading = false
      })
    },
    showAddAttrTable() {
      this.disabledCategorySelect = true
      this.attrInfo = {
        id: '',
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
      this.isRepatAttr = false
    },
    addAttrValueInput() {
      const len = this.attrInfo.attrValueList.length
      const attrValue = this.attrInfo.attrValueList[len - 1] || {}
      if (len > 0 && (!attrValue.valueName || attrValue.valueName.trim() === '')) {
        return
      }
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        isEdit: true
      })
      this.$nextTick(() => {
        this.$refs[len].focus()
      })
    },
    showAttrValueSpan(row, index) {
      if (row.valueName.trim() === '') {
        this.$message('请输入正常的属性值')
        this.$refs[index].focus()
        return
      }
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return item.valueName === row.valueName
        }
      })
      if (isRepat) {
        this.$message(`${this.attrInfo.attrName}存在重复属性值名称`)
        this.isRepatAttr = true
        return
      }
      if (this.isRepatAttr) {
        this.isRepatAttr = false
      }
      if (row.isEdit === undefined) {
        this.$set(row, 'isEdit', false)
      } else {
        row.isEdit = false
      }
    },
    showAttrValueInput(row, index) {
      if (row.isEdit === undefined) {
        this.$set(row, 'isEdit', true)
      } else {
        row.isEdit = true
      }
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(row, index) {
      this.attrInfo.attrValueList.splice(index, 1)
      if (this.isRepatAttr) {
        this.isRepatAttr = this.attrInfo.attrValueList.some(item => {
          if (row !== item) {
            return item.valueName === row.valueName
          }
        })
      }
    },
    handleAttrValueEdit(row) {
      this.attrInfo = cloneDeep(row)
      this.disabledCategorySelect = true
      this.isRepatAttr = false
    },
    handleAttrDelete(row) {
      this.$Api.attr.deleteAttr(row.id).then(() => {
        this.$message.success('删除成功')
        this.getAttrInfoList()
      }).catch(error => {
        console.log(error.message)
        this.$message.error('删除失败')
      })
    },
    checkAttrNameAndAttrValue() {
      return this.attrInfo.attrName.trim() === '' || this.attrInfo.attrValueList.length < 1
    },
    saveOrUpdateAttrValue() {
      if (this.isRepatAttr) {
        this.$message(`${this.attrInfo.attrName}存在重复属性值名称`)
        return
      }
      if (this.checkAttrNameAndAttrValue()) {
        return
      }
      this.$Api.attr.saveAttrInfo(this.attrInfo).then(response => {
        this.$message.success('保存成功')
        this.disabledCategorySelect = false
        this.getAttrInfoList()
      }).catch(error => {
        console.log(error.message)
        this.$message.error('保存失败')
      })
    }
  }
}
</script>

<style scoped>

</style>
