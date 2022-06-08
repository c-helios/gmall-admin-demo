import request from '@/utils/request'

// 商品SKU接口

// GET /admin/product/cancelSale/{skuId}
// cancelSale
export function cancelSale(skuId) {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'GET'
  })
}

// DELETE /admin/product/deleteSku/{skuId}
// deleteSku
export function deleteSku(skuId) {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'DELETE'
  })
}

// GET /admin/product/findBySpuId/{spuId}
// findBySpuId
export function findBySpuId(spuId) {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'GET'
  })
}

// GET /admin/product/getSkuById/{skuId}
// getById
export function getSkuById(skuId) {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'GET'
  })
}

// GET /admin/product/inner/findSkuInfoByKeyword/{keyword}
// findSkuInfoByKeyword
export function findSkuInfoByKeyword(keyword) {
  return request({
    url: `/admin/product/inner/findSkuInfoByKeyword/${keyword}`,
    method: 'GET'
  })
}

// POST /admin/product/inner/findSkuInfoBySkuIdList
// findSkuInfoBySkuIdList
export function findSkuInfoBySkuIdList(data) {
  return request({
    url: '/admin/product/inner/findSkuInfoBySkuIdList',
    method: 'POST',
    data
  })
}

// GET /admin/product/list/{page}/{limit}
// index
export function getProductList(page, limit) {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'GET'
  })
}

// GET /admin/product/onSale/{skuId}
// onSale
export function onSale(skuId) {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'GET'
  })
}

// POST /admin/product/saveSkuInfo
// saveSkuInfo
export function saveSkuInfo(data) {
  return request({
    url: '/admin/product/saveSkuInfo',
    method: 'POST',
    data
  })
}

// GET /admin/product/spuImageList/{spuId}
// getSpuImageList
export function getSpuImageList(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'GET'
  })
}

// GET /admin/product/spuSaleAttrList/{spuId}
// getSpuSaleAttrList
export function getSpuSaleAttrList(spuId) {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'GET'
  })
}

// POST /admin/product/updateSkuInfo
// updateSkuInfo
export function updateSkuInfo(data) {
  return request({
    url: '/admin/product/updateSkuInfo',
    method: 'POST',
    data
  })
}
