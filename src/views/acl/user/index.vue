<template>
  <div v-loading="loading">
    <el-form inline>
      <el-form-item>
        <el-input v-model="username" placeholder="用户名" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </el-form>
    <el-button type="primary" @click="userDialog = true">添加</el-button>
    <el-button type="danger" :disabled="selectedList.length === 0" @click="batchDelUser">批量删除</el-button>
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
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickName" label="用户昵称" width="120" />
      <el-table-column prop="roleName" label="权限列表" />
      <el-table-column prop="gmtCreate" label="创建时间" width="160" />
      <el-table-column prop="gmtModified" label="更新时间" width="160" />
      <el-table-column label="操作" width="200">
        <template slot-scope="{row}">
          <hint-button type="info" icon="el-icon-user" size="mini" title="分配" @click="assignRole(row)" />
          <hint-button type="primary" icon="el-icon-edit" size="mini" title="编辑" @click="editUser(row)" />
          <el-popconfirm :title="`确定将${row.username}删除吗？`" @onConfirm="delUser(row)">
            <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除" />
          </el-popconfirm>
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
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" @closed="closeUserDialog">
      <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userInfo.nickName" />
        </el-form-item>
        <el-form-item v-show="!userInfo.id" label="用户密码" prop="password">
          <el-input v-model="userInfo.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置角色" :visible.sync="roleDialog" @closed="closeRoleDialog">
      <el-form ref="userInfo" :model="userInfo" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAllRole" :indeterminate="isIndeterminate" @change="handleCheckAllRoleChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedRoles" style="margin: 15px 0;" @change="handleCheckedCRoleChange">
            <el-checkbox v-for="role in allRolesList" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      username: '',
      dataList: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      userInfo: {
        id: '',
        username: '',
        nickName: '',
        password: ''
      },
      userDialog: false,
      roleDialog: false,
      selectedList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '请输入长度大于6个字符的密码', trigger: 'blur' }
        ]
      },
      checkAllRole: false,
      isIndeterminate: false,
      allRolesList: [],
      checkedRoles: [],
      loading: true
    }
  },
  computed: {
    userDialogTitle() {
      return this.userInfo.id ? '修改用户' : '添加用户'
    },
    allRoles() {
      return this.allRolesList.map(item => item.id)
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据
    getDataList(pageNo = 1) {
      this.pageNo = pageNo
      this.loading = true
      this.$Api.user.userList(this.pageNo, this.pageSize, { username: this.username }).then(res => {
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
      this.username = ''
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getDataList(this.pageNo)
    },
    // 保存或修改
    saveOrUpdateUser() {
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          this.$Api.user.saveOrUpdate(this.userInfo).then(res => {
            this.$message.success('保存成功!')
            this.refresh()
            this.userDialog = false
          })
        } else {
          return false
        }
      })
    },
    // 批量删除
    batchDelUser() {
      if (!this.selectedList || this.selectedList.length === 0) {
        this.$message.info('请选择删除用户!')
        return
      }
      this.$confirm('确定将选中的用户删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = this.selectedList.map(item => item.id)
        this.$Api.user.batchRemove(idList).then(res => {
          this.$message.success('删除成功!')
          this.refresh()
        })
      }).catch(() => {})
    },
    // 列表选择
    handleSelectionChange(selection) {
      this.selectedList = selection
    },
    assignRole(user) {
      this.roleDialog = true
      this.userInfo = user
      this.$Api.user.toAssign(user.id).then(res => {
        this.allRolesList = res.data.allRolesList
        this.checkedRoles = res.data.assignRoles && res.data.assignRoles.map(item => item.id)
        this.checkAllRole = this.checkedRoles.length === this.allRolesList.length
        this.isIndeterminate = this.checkedRoles.length !== 0 && !this.checkAllRole
      })
    },
    handleCheckAllRoleChange(val) {
      this.checkedRoles = val ? this.allRoles : []
      this.isIndeterminate = false
    },
    handleCheckedCRoleChange(value) {
      const checkedCount = value.length
      this.checkAllRole = checkedCount === this.allRolesList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRolesList.length
    },
    saveUserRole() {
      const userId = this.userInfo.id
      const roleId = this.checkedRoles.join(',')
      this.$Api.user.doAssign({ userId, roleId }).then(res => {
        this.$message.success('设置成功')
        this.refresh()
      })
      this.roleDialog = false
    },
    closeRoleDialog() {
      this.closeUserDialog()
      this.allRolesList = []
      this.checkedRoles = []
    },
    editUser(user) {
      this.userDialog = true
      this.userInfo = user
      // this.$Api.user.getById(user.id).then(res => {
      //   this.userInfo = res.data.item
      // })
    },
    closeUserDialog() {
      this.$refs.userInfo.resetFields()
      this.userInfo = {
        id: '',
        username: '',
        nickName: '',
        password: ''
      }
    },
    delUser(user) {
      this.$Api.user.deleteById(user.id).then(res => {
        this.$message.success('删除成功')
        this.pageNo = this.dataList.length - 1 > 0 ? this.pageNo : this.pageNo - 1
        this.getDataList(this.pageNo > 0 ? this.pageNo : 1)
      })
    }
  }
}
</script>

<style scoped>

</style>
