import request from '@/utils/request'

// 角色管理

// DELETE /admin/acl/role/batchRemove
// 根据id列表删除角色
export function batchRemove(data) {
  return request({
    url: '/admin/acl/role/batchRemove',
    method: 'DELETE',
    data
  })
}

// GET /admin/acl/role/get/{id}
// 获取角色
export function getById(id) {
  return request({
    url: `/admin/acl/role/get/${id}`,
    method: 'GET'
  })
}

// DELETE /admin/acl/role/remove/{id}
// 删除角色
export function deleteById(id) {
  return request({
    url: `/admin/acl/role/remove/${id}`,
    method: 'DELETE'
  })
}

// POST /admin/acl/role/save
// 新增角色
// PUT /admin/acl/role/update
// 修改角色
export function saveOrUpdate(data) {
  if (data.id) {
    return request({
      url: '/admin/acl/role/update',
      method: 'PUT',
      data
    })
  }
  return request({
    url: '/admin/acl/role/save',
    method: 'POST',
    data
  })
}

// GET /admin/acl/role/{page}/{limit}
// 获取角色分页列表
export function roleList(page, limit, params) {
  return request({
    url: `/admin/acl/role/${page}/${limit}`,
    method: 'GET',
    params
  })
}
