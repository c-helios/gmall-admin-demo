<template>
  <div style="maring:0px;padding:0px">
    <div class="header">
      <span>{{ roleName }}</span>
    </div>
    <el-tree
      ref="tree"
      style="margin:20px 0px"
      :data="menuList"
      show-checkbox
      default-expand-all
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
    />
    <div class="footer">
      <el-button :loading="loading" type="primary" @click="saveAuth">保存</el-button>
      <el-button @click="toRole">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleAuth',
  data() {
    return {
      menuList: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false
    }
  },
  computed: {
    roleId() {
      return this.$route.params.roleId
    },
    roleName() {
      return this.$route.query.roleName
    }
  },
  beforeRouteLeave(to, from, next) {
    // if (to.path === '/acl/role/list') {
    //   to.meta.keepAlive = true
    // } else {
    //   to.meta.keepAlive = false
    // }
    next()
  },
  mounted() {
    this.$Api.permission.toAssign(this.roleId).then(res => {
      this.menuList = res.data.children
      if (res.data.children) {
        this.defaultCheckedKeys = []
        this.getCheckedKeys(res.data.children, this.defaultCheckedKeys)
      }
      if (this.defaultCheckedKeys && this.defaultCheckedKeys.length > 0) {
        this.defaultExpandedKeys = this.defaultCheckedKeys
      } else {
        this.defaultExpandedKeys = this.menuList.map(item => item.id)
      }
    }).catch(_ => {
      this.menuList = []
    })
  },
  methods: {
    getCheckedKeys(children, checkedKeys) {
      if (children && children.length > 0) {
        for (const item of children) {
          if (item && item.select) {
            checkedKeys.push(item.id)
          }
          this.getCheckedKeys(item.children, checkedKeys)
        }
      }
    },
    saveAuth() {
      this.loading = true
      const permissionIdList = this.$refs.tree.getCheckedKeys()
      this.$Api.permission.doAssignAcl({ permissionIdList, roleId: this.roleId }).then(res => {
        this.loading = false
        this.$message.success(res.$message || '分配权限成功')
        const roleName = this.$route.query.roleName
        const roles = this.$store.getters.roles
        this.$router.push({ name: 'Role' }, () => {
          // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
          if (roles.includes(roleName)) {
            window.location.reload()
          }
        })
      })
    },
    toRole() {
      this.$router.push({ name: 'Role' })
      // this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #F8F8FF;
  height: 40px;
  width: 100%;
  margin: 0px 20px 0px 0px;
  vertical-align: center;
  border: 1px solid #F5F5F5;
  border-radius: 5px;
}
.header span {
  line-height: 40px;
  margin: 0px 20px;
  color: #A9A9A9;
}

.footer {
  margin: 20px 0px;
}
</style>
