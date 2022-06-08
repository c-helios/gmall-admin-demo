<template>
  <div v-loading="loading">
    <el-form inline>
      <el-form-item>
        <el-input v-model="roleName" placeholder="角色名" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </el-form>
    <el-button type="primary" @click="roleDialog = true">添加</el-button>
    <el-button type="danger" :disabled="selectedList.length === 0" @click="batchDelRole">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="margin: 20px 0px;width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="角色名称">
        <template slot-scope="{row, $index}">
          <el-row v-show="row.isEdit" :gutter="10">
            <el-col :span="20"><el-input :ref="`editRoleName-${$index}`" v-model="row.roleName" size="small" /></el-col>
            <el-col :span="4"><el-button type="warning" icon="el-icon-refresh" size="small" @click="cancelEdit(row)">取消</el-button></el-col>
          </el-row>
          <span v-show="!row.isEdit">{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row, $index}">
          <hint-button type="info" icon="el-icon-info" size="mini" title="分配权限" @click="toAuth(row)" />
          <hint-button type="primary" :icon="row.isEdit ? 'el-icon-check' : 'el-icon-edit'" size="mini" title="编辑" @click="editRole(row, $index)" />
          <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除" @click="delRole(row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pageNo"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, ->, sizes, total"
      @current-change="getDataList"
      @size-change="changePageSize"
    />
    <el-dialog title="添加角色" :visible.sync="roleDialog" width="400px" @closed="closeRoleDialog">
      <el-form ref="roleInfo" :model="roleInfo" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      roleName: '',
      dataList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      selectedList: [],
      roleInfo: {
        id: '',
        roleName: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      roleDialog: false,
      preEditRole: {},
      loading: true
    }
  },
  computed: {

  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据
    getDataList(pageNo = 1) {
      this.pageNo = pageNo
      this.loading = true
      this.$Api.role.roleList(this.pageNo, this.pageSize, { roleName: this.roleName }).then(res => {
        this.dataList = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(_ => {
        this.dataList = []
        this.total = 0
        this.loading = false
      })
    },
    // 刷新页面
    refresh() {
      this.pageNo = this.dataList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
      this.getDataList(this.pageNo > 0 ? this.pageNo : 1)
    },
    search() {
      this.getDataList()
    },
    // 重置查询条件
    resetSearch() {
      this.roleName = ''
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getDataList(this.pageNo)
    },
    // 列表选择
    handleSelectionChange(selection) {
      this.selectedList = selection
    },
    // 批量删除
    batchDelRole() {
      if (!this.selectedList || this.selectedList.length === 0) {
        this.$message.info('请选择删除角色!')
        return
      }
      this.$confirm('确定将选中的角色删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = this.selectedList.map(item => item.id)
        this.$Api.role.batchRemove(idList).then(res => {
          this.$message.success('删除成功!')
          this.refresh()
        })
      }).catch(() => {})
    },
    // 保存
    saveRole() {
      this.$refs.roleInfo.validate((valid) => {
        if (valid) {
          const success = this.saveOrUpdateRole(this.roleInfo)
          if (success) {
            this.roleDialog = false
          }
        } else {
          return false
        }
      })
    },
    async saveOrUpdateRole(role) {
      let success = false
      await this.$Api.role.saveOrUpdate(role).then(res => {
        this.$message.success('保存成功!')
        this.refresh()
        success = true
      })
      return success
    },
    closeRoleDialog() {
      this.roleInfo = {
        id: '',
        roleName: ''
      }
      this.$refs.roleInfo.resetFields()
    },
    toAuth(role) {
      this.$router.push({ path: `/acl/role/auth/${role.id}`, query: { roleName: role.roleName }})
    },
    editRole(role, index) {
      if (role.isEdit) {
        if (!role.roleName || role.roleName.trim() === '') {
          this.$message.warning('请输入角色名')
          return
        }
        const success = this.saveOrUpdateRole(role)
        if (success) {
          role.isEdit = false
        }
        this.preEditRole = {}
      } else {
        if (this.preEditRole && this.preEditRole.isEdit) {
          this.preEditRole.isEdit = false
          this.preEditRole.roleName = this.preEditRole.beforRoleName
        }
        role.beforRoleName = role.roleName
        this.$set(role, 'isEdit', true)
        this.$nextTick(() => {
          this.$refs[`editRoleName-${index}`].$refs.input.focus()
        })
        this.preEditRole = role
      }
    },
    cancelEdit(role) {
      role.isEdit = false
      role.roleName = role.beforRoleName
    },
    delRole(role) {
      this.$confirm(`确定将${role.roleName}角色删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Api.role.deleteById(role.id).then(res => {
          this.pageNo = this.dataList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
          this.getDataList(this.pageNo > 0 ? this.pageNo : 1)
          this.$message.success('删除成功')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
