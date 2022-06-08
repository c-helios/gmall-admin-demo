import request from '@/utils/request'

// 商品基础属性接口

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList
export function getAttrInfoList(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET'
  })
}

// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr
export function deleteAttr(attrId) {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'DELETE'
  })
}

// GET /admin/product/getAttrValueList/{attrId}
// getAttrValueList
export function getAttrValueList(attrId) {
  return request({
    url: `/admin/product/getAttrValueList/${attrId}`,
    method: 'GET'
  })
}

// POST /admin/product/saveAttrInfo
// saveAttrInfo
export function saveAttrInfo(data) {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'POST',
    data
  })
}
