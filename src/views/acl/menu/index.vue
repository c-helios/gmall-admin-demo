<template>
  <div v-loading="loading">
    <el-table
      style="width: 100%"
      row-key="id"
      border
      :data="menuList"
      :expand-row-keys="expandRowKeys"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="code"
        label="权限值"
      />
      <el-table-column
        prop="toCode"
        label="跳转权限值"
      />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <hint-button type="primary" icon="el-icon-plus" size="mini" :disabled="row.level === 4" :title="getAddTitle(row.level)" @click="toAddMennu(row)" />
          <hint-button type="primary" icon="el-icon-edit" size="mini" :disabled="row.level === 1" :title="row.level === 4 ? '修改功能' : '修改菜单'" @click="toEditMenu(row)" />
          <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" :disabled="row.level === 1" title="删除" @click="handleMenuDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="menuDialogTitle" :visible.sync="menuDialog" @closed="closeMenuDialog">
      <el-form ref="menuInfo" :model="menuInfo" :rules="formRules" label-width="120px">
        <el-form-item v-if="menuInfo.level > 2 && !menuInfo.id" label="父级名称">
          <el-input v-model="menuInfo.pname" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="menuInfo.name" />
        </el-form-item>
        <el-form-item :label="menuInfo.level === 4 ? '功能权限值' : '权限值'" prop="code">
          <el-input v-model="menuInfo.code" />
        </el-form-item>
        <el-form-item v-if="menuInfo.level === 4" label="跳转路由值" prop="toCode">
          <el-input v-model="menuInfo.toCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialog = false">取 消</el-button>
        <el-button type="primary" @click.prevent="saveOrUpdateMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 菜单权限校验规则
const menuRules = {
  name: [{ required: true, message: '名称必须输入' }],
  code: [{ required: true, message: '权限值必须输入' }]
}
// 按钮功能权限校验
const btnRules = {
  name: [{ required: true, message: '名称必须输入' }],
  code: [{ required: true, trigger: 'blur', message: '功能权限值必须输入' }]
}

export default {
  name: 'Menu',
  data() {
    return {
      menuList: [],
      expandRowKeys: [],
      menuInfo: {
        level: 0,
        name: '',
        code: '',
        toCode: ''
      },
      menuDialog: false,
      loading: true

    }
  },
  computed: {
    formRules() {
      if (this.menuInfo.level === 4) {
        return btnRules
      }
      return menuRules
    },
    menuDialogTitle() {
      const { id, level } = this.menuInfo
      if (id) {
        return level === 4 ? '修改功能' : '修改菜单'
      } else {
        return level === 4 ? '添加功能' : `添加${level === 2 ? '一级' : '二级'}菜单`
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.loading = true
      this.$Api.permission.permission().then(res => {
        this.menuList = res.data.children
        this.expandRowKeys = this.menuList.map(item => item.id)
        this.loading = false
      }).catch(_ => {
        this.menuList = []
        this.loading = false
      })
    },
    getAddTitle(level) {
      return ''
    },
    toAddMennu(menu) {
      this.menuDialog = true
      this.menuInfo.pid = menu.id
      this.menuInfo.pname = menu.name
      this.menuInfo.level = menu.level + 1
      this.menuInfo.type = this.menuInfo.level === 4 ? 2 : 1
      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.menuInfo.clearValidate())
    },
    toEditMenu(menu) {
      this.menuDialog = true
      // 使用浅拷贝
      this.menuInfo = { ...menu }
      this.menuInfo.type = this.menuInfo.level === 4 ? 2 : 1
      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.menuInfo.clearValidate())
    },
    saveOrUpdateMenu() {
      this.$refs.menuInfo.validate((valid) => {
        if (valid) {
          // pname不需要携带
          const { pname, ...info } = this.menuInfo
          this.$Api.permission.saveOrUpdate(info).then(res => {
            this.$message.success('保存成功')
            this.menuDialog = false
            this.getDataList()
          })
        } else {
          return false
        }
      })
    },
    closeMenuDialog() {
      this.menuInfo = {
        level: 0,
        name: '',
        code: '',
        toCode: ''
      }
    },
    handleMenuDelete(menu) {
      this.$confirm(`确定将${menu.name}角色删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Api.permission.batchRemove(menu.id).then(res => {
          this.$message.success('删除成功')
          this.getDataList()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
