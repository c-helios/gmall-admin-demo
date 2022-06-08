import request from '@/utils/request'

// 菜单管理
// GET /admin/acl/permission
// 获取菜单
export function permission() {
  return request({
    url: '/admin/acl/permission',
    method: 'GET'
  })
}

// POST /admin/acl/permission/doAssign
// 给角色分配权限
export function doAssign(data) {
  return request({
    url: '/admin/acl/permission/doAssign',
    method: 'POST',
    data
  })
}

// POST /admin/acl/permission/doAssignAcl
// 给角色分配权限
export function doAssignAcl(data) {
  return request({
    url: '/admin/acl/permission/doAssignAcl',
    method: 'POST',
    data
  })
}

// DELETE /admin/acl/permission/remove/{id}
// 递归删除菜单
export function batchRemove(id) {
  return request({
    url: `/admin/acl/permission/remove/${id}`,
    method: 'DELETE'
  })
}

// POST /admin/acl/permission/save
// 新增菜单
// PUT /admin/acl/permission/update
// 修改菜单
export function saveOrUpdate(data) {
  if (data.id) {
    return request({
      url: '/admin/acl/permission/update',
      method: 'PUT',
      data
    })
  }
  return request({
    url: '/admin/acl/permission/save',
    method: 'POST',
    data
  })
}

// GET /admin/acl/permission/toAssign/{roleId}
// 根据角色获取菜单
export function toAssign(roleId) {
  return request({
    url: `/admin/acl/permission/toAssign/${roleId}`,
    method: 'GET'
  })
}
