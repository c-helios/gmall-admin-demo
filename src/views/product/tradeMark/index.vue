<template>
  <div v-loading="loading">
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark">添加</el-button>
    <el-dialog :title="tradeMark.id ? '编辑':'新增'" :visible.sync="dialogTradeMarkVisible" :before-close="closeTradeMarkDialog">
      <el-form ref="tradeMark" :rules="rules" :model="tradeMark">
        <el-form-item label="品牌名称" prop="tmName" label-width="120px">
          <el-input v-model="tradeMark.tmName" style="margin: 0px 20px; width:80%" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
          <el-upload
            style="margin: 0px 20px;"
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tradeMark.logoUrl" :src="tradeMark.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="validateLogoUrl" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTradeMarkVisible = false;resetValidate()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="dataList" style="width: 100%;margin-top:20px" border>
      <el-table-column type="index" prop="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" align="center" />
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <slot slot-scope="{row}">
          <img :src="row.logoUrl" style="width:80px;height:80px">
        </slot>
      </el-table-column>
      <el-table-column label="操作">
        <slot slot-scope="{row}">
          <el-button size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </slot>
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
      @current-change="getDataList"
    />
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      dataList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      // dialogTradeMarkTitle: '新增',
      dialogTradeMarkVisible: false,
      tradeMark: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: ['blur', 'change'] }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'blur' }
        ]
      },
      loading: true
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList(pageNo = 1) {
      this.pageNo = pageNo
      this.$Api.tradeMark.getBaseTrademarkPageList(this.pageNo, this.pageSize).then(response => {
        const result = response.data
        this.dataList = result.records
        this.total = result.total
        this.loading = false
      }).catch(error => {
        this.$message.error(error.message)
        this.loading = false
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    addTradeMark() {
      // this.dialogTradeMarkTitle = '新增'
      this.dialogTradeMarkVisible = true
      this.tradeMark.id = undefined
      this.tradeMark.tmName = ''
      this.tradeMark.logoUrl = ''
      // this.$nextTick(() => {
      //   this.$refs.tradeMark.resetFields()
      // })
    },
    updateTradeMark(row) {
      this.tradeMark = row
      // this.dialogTradeMarkTitle = '编辑'
      this.dialogTradeMarkVisible = true
    },
    saveOrUpdateTradeMark() {
      this.$refs.tradeMark.validate((valid) => {
        if (valid) {
          this.dialogTradeMarkVisible = false
          if (this.tradeMark.id) {
            // 编辑
            this.$Api.tradeMark.updateBaseTrademark(this.tradeMark).then(response => {
              this.$message.success('修改成功')
              this.getDataList(this.pageNo)
            }).catch(error => {
              this.$message.error(error.message)
            })
          } else {
            // 新增
            this.$Api.tradeMark.saveBaseTrademark(this.tradeMark).then(response => {
              this.$message.success('新增成功')
              this.getDataList()
            }).catch(error => {
              this.$message.error(error.message)
            })
          }
        } else {
          return false
        }
      })
    },
    deleteTradeMark(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Api.tradeMark.removeBaseTrademark(row.id).then(response => {
          this.pageNo = this.dataList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
          this.getDataList(this.pageNo > 0 ? this.pageNo : 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(error => {
          this.$message.error(error.message)
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.tradeMark.logoUrl = URL.createObjectURL(file.raw)
      this.$refs.tradeMark.validateField('logoUrl')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    validateLogoUrl() {
      this.$refs.tradeMark.validateField('logoUrl')
    },
    resetValidate() {
      this.$refs.tradeMark.resetFields()
    },
    closeTradeMarkDialog(done) {
      this.resetValidate()
      done()
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
