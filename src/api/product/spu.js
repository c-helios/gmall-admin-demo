import request from '@/utils/request'

// 商品SPU接口

// GET /admin/product/baseSaleAttrList
// getBaseSaleAttrList
export function getBaseSaleAttrList() {
  return request({
    url: '/admin/product/baseSaleAttrList',
    method: 'GET'
  })
}

// DELETE /admin/product/deleteSpu/{spuId}
// deleteSpu
export function deleteSpu(spuId) {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'DELETE'
  })
}

// GET /admin/product/findSpuInfoByKeyword/{keyword}
// findSpuInfoByKeyword
export function findSpuInfoByKeyword(keyword) {
  return request({
    url: `/admin/product/findSpuInfoByKeyword//${keyword}`,
    method: 'GET'
  })
}

// GET /admin/product/getSpuById/{spuId}
// 获取spu基本信息
export function getSpuById(spuId) {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'GET'
  })
}

// POST /admin/product/inner/findSpuInfoBySpuIdList
// findSpuInfoBySpuIdList
export function findSpuInfoBySpuIdList(data) {
  return request({
    url: '/admin/product/inner/findSpuInfoBySpuIdList',
    method: 'POST',
    data
  })
}

// POST /admin/product/saveSpuInfo
// saveSpuInfo
// POST /admin/product/updateSpuInfo
// 更改spu信息
export function saveOrUpdateSpuInfo(data) {
  if (data.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'POST',
      data
    })
  }
  return request({
    url: '/admin/product/saveSpuInfo',
    method: 'POST',
    data
  })
}

// GET /admin/product/{page}/{limit}
// index
export function getProductPageList(params, page, limit) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: 'GET',
    params
  })
}

