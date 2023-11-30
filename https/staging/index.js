import request from '@/utils/request_custom.js'

// 获取工单列表，勘查工单workOrderType-1 ， 检修工单workOrderType-2
export function getWorkOrderPageData(data) {
	return request({
		url: '/work-order/page',
		method: 'post',
		data
	})
}
// 获取工单详情
export function getWorkOrderDetailById(id) {
	return request({
		url: `/work-order/find?id=${id}`,
		method: 'get',
	})
}
// 获取工序列表
export function getProcessList(data) {
	return request({
		url: '/work-procedure/page-info',
		method: 'post',
		data
	})
}
// 获取单个工序详情
export function getProcessDetail(data) {
	return request({
		url: '/work-procedure/bind-info',
		method: 'post',
		data
	})
}
// 获取bom列表
export function getBomList(data) {
	return request({
		url: '/evo-ims-overhaul/work-order/page',
		method: 'post',
		data
	})
}
// 获取返厂清单列表
export function getReturnList(data) {
	return request({
		url: '/evo-ims-overhaul/work-order/page',
		method: 'post',
		data
	})
}

// 获取mes工作内容
export function getMesWorkContent(data) {
	return request({
		url: `/work-content-mes/query?craftId=${data.craftId}`,
		method: 'get',
		data
	})
}

// 上报工作内容
export function setMesWorkContent(data) {
	return request({
		url: `/work-content-mes/query?craftId=${data.craftId}`,
		method: 'get',
		data
	})
}