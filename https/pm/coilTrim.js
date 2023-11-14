import request from '@/utils/request.js'

//查找生产号
export function findProductNum(params) {
  return request({
    url: '/pbproduction/coilTrim/findProductNum',
    method: 'GET',
    data: params
  })
}


export function getCoilInfoByScanCode(params) {
  return request({
    url: '/pbproduction/coilTrim/getCoilInfoByScanCode',
    method: 'GET',
    data: params
  })
}

// 查找线圈信息
export function getCoilList(params) {
  return request({
    url: '/pbproduction/coilTrim/findCoilList',
    method: 'GET',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      productNo: params.productNo, // 生产号
      trimStatus: params.trimStatus//是否为打印组标签
    }
  })
}

//保存电阻值
export function saveResistanceValue(data){
  return request({
    url: '/pbproduction/coilTrim/saveResistanceValue',
    method: 'POST',
    data
  })
}

// 线圈电阻预配平
export function preTrimCoil(data) {
  return request({
    url: '/pbproduction/coilTrim/preTrimCoil',
    method: 'POST',
    data
  })
}


// 选择3条数据进行电阻配平
export function handTrim(data) {
  return request({
    url: '/pbproduction/coilTrim/handTrim',
    method: 'POST',
    data
  })
}