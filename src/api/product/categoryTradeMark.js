import request from '@/utils/request'

// 分类品牌管理

// GET /admin/product/baseCategoryTrademark/findCurrentTrademarkList/{category3Id}
// 根据category3Id获取可选品牌列表
export function findCurrentTrademarkList(category3Id) {
  return request({
    url: `/admin/product/baseCategoryTrademark/findCurrentTrademarkList/${category3Id}`,
    method: 'GET'
  })
}

// GET /admin/product/baseCategoryTrademark/findTrademarkList/{category3Id}
// 根据category3Id获取品牌列表
export function findTrademarkList(category3Id) {
  return request({
    url: `/admin/product/baseCategoryTrademark/findTrademarkList/${category3Id}`,
    method: 'GET'
  })
}

// DELETE /admin/product/baseCategoryTrademark/remove/{category3Id}/{trademarkId}
// 删除分类品牌关联
export function removeTrademark(category3Id, trademarkId) {
  return request({
    url: `/admin/product/baseCategoryTrademark/remove/${category3Id}/${trademarkId}`,
    method: 'DELETE'
  })
}

// POST /admin/product/baseCategoryTrademark/save
// 保存分类品牌关联
export function saveCategoryTrademark(data) {
  return request({
    url: '/admin/product/baseCategoryTrademark/save',
    method: 'POST',
    data
  })
}

