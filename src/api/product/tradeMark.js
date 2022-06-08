import request from '@/utils/request'

// Base Trademark

// GET /admin/product/baseTrademark/findBaseTrademarkByKeyword/{keyword}
// findBaseTrademarkByKeyword
export function findBaseTrademarkByKeyword(keyword) {
  return request({
    url: `/admin/product/baseTrademark/findBaseTrademarkByKeyword/${keyword}`,
    method: 'GET'
  })
}

// GET /admin/product/baseTrademark/get/{id}
// 获取BaseTrademark
export function getBaseTrademark(id) {
  return request({
    url: `/admin/product/baseTrademark/get/${id}`,
    method: 'GET'
  })
}

// GET /admin/product/baseTrademark/getTrademarkList
// getTrademarkList
export function getTrademarkList() {
  return request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'GET'
  })
}

// POST /admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList
// findBaseTrademarkByTrademarkIdList
export function findBaseTrademarkByTrademarkIdList(data) {
  return request({
    url: '/admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList',
    method: 'POST',
    data
  })
}

// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark
export function removeBaseTrademark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark
export function saveBaseTrademark(data) {
  return request({
    url: '/admin/product/baseTrademark/save',
    method: 'POST',
    data
  })
}

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark
export function updateBaseTrademark(data) {
  return request({
    url: '/admin/product/baseTrademark/update',
    method: 'PUT',
    data
  })
}

// GET /admin/product/baseTrademark/{page}/{limit}
// 分页列表
export function getBaseTrademarkPageList(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET'
  })
}

