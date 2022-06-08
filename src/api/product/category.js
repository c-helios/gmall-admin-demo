import request from '@/utils/request'

// 商品分类接口

// GET /admin/product/get/category1/{id}
// 获取一级分类
export function getCategory1ById(id) {
  return request({
    url: `/admin/product/get/category1/${id}`,
    method: 'GET'
  })
}

// GET /admin/product/get/category2/{id}
// 获取二级分类
export function getCategory2ById(id) {
  return request({
    url: `/admin/product/get/category2/${id}`,
    method: 'GET'
  })
}

// GET /admin/product/get/category3/{id}
// 获取三级分类
export function getCategory3ById(id) {
  return request({
    url: `/admin/product/get/category3/${id}`,
    method: 'GET'
  })
}

// GET /admin/product/getCategory1
// getCategory1
export function getCategory1() {
  return request({
    url: '/admin/product/getCategory1',
    method: 'GET'
  })
}

// GET /admin/product/getCategory2/{category1Id}
// getCategory2
export function getCategory2(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'GET'
  })
}

// GET /admin/product/getCategory3/{category2Id}
// getCategory3
export function getCategory3(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'GET'
  })
}

// POST /admin/product/inner/findBaseCategory3ByCategory3IdList
// findBaseCategory3ByCategory3IdList
export function findBaseCategory3ByCategory3IdList(data) {
  return request({
    url: '/admin/product/inner/findBaseCategory3ByCategory3IdList',
    method: 'POST',
    data
  })
}

// DELETE /admin/product/removeCategory1/{id}
// 删除一级分类
export function removeCategory1(id) {
  return request({
    url: `/admin/product/removeCategory1/${id}`,
    method: 'DELETE'
  })
}

// DELETE /admin/product/removeCategory2/{id}
// 删除二级分类
export function removeCategory2(id) {
  return request({
    url: `/admin/product/removeCategory2/${id}`,
    method: 'DELETE'
  })
}

// DELETE /admin/product/removeCategory3/{id}
// 删除三级分类
export function removeCategory3(id) {
  return request({
    url: `/admin/product/removeCategory3/${id}`,
    method: 'DELETE'
  })
}

// POST /admin/product/saveCategory1
// 新增一级分类
export function saveCategory1(data) {
  return request({
    url: '/admin/product/saveCategory1',
    method: 'POST',
    data
  })
}

// POST /admin/product/saveCategory2
// 新增二级分类
export function saveCategory2(data) {
  return request({
    url: '/admin/product/saveCategory2',
    method: 'POST',
    data
  })
}

// POST /admin/product/saveCategory3
// 新增三级分类
export function saveCategory3(data) {
  return request({
    url: '/admin/product/saveCategory3',
    method: 'POST',
    data
  })
}

// PUT /admin/product/updateeCategory1
// 修改一级分类
export function updateeCategory1(data) {
  return request({
    url: '/admin/product/updateeCategory1',
    method: 'PUT',
    data
  })
}

// PUT /admin/product/updateeCategory2
// 修改二级分类
export function updateeCategory2(data) {
  return request({
    url: '/admin/product/updateeCategory2',
    method: 'PUT',
    data
  })
}

// PUT /admin/product/updateeCategory3
// 修改三级分类
export function updateeCategory3(data) {
  return request({
    url: '/admin/product/updateeCategory3',
    method: 'PUT',
    data
  })
}

