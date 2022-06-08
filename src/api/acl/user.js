import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'POST',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'GET',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'POST'
  })
}
// 用户管理

// DELETE /admin/acl/user/batchRemove
// 根据id列表删除管理用户
export function batchRemove(data) {
  return request({
    url: '/admin/acl/user/batchRemove',
    method: 'DELETE',
    data
  })
}

// GET /admin/acl/user/toAssign/{userId}
// 根据用户获取角色数据
export function toAssign(userId) {
  return request({
    url: `/admin/acl/user/toAssign/${userId}`,
    method: 'GET'
  })
}

// POST /admin/acl/user/doAssign
// 根据用户分配角色
export function doAssign(params) {
  return request({
    url: '/admin/acl/user/doAssign',
    method: 'POST',
    params
  })
}

// GET /admin/acl/user/get/{id}
// 获取管理用户
export function getById(id) {
  return request({
    url: `/admin/acl/user/get/${id}`,
    method: 'GET'
  })
}

// DELETE /admin/acl/user/remove/{id}
// 删除管理用户
export function deleteById(id) {
  return request({
    url: `/admin/acl/user/remove/${id}`,
    method: 'DELETE'
  })
}

// POST /admin/acl/user/save
// 新增管理用户
// PUT /admin/acl/user/update
// 修改管理用户
export function saveOrUpdate(data) {
  if (data.id) {
    return request({
      url: '/admin/acl/user/update',
      method: 'PUT',
      data
    })
  }
  return request({
    url: '/admin/acl/user/save',
    method: 'POST',
    data
  })
}

// GET /admin/acl/user/{page}/{limit}
// 获取管理用户分页列表
export function userList(page, limit, params) {
  return request({
    url: `/admin/acl/user/${page}/${limit}`,
    method: 'GET',
    params
  })
}
