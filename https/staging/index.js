import request from '@/utils/request_custom.js'

export function getWorkOrderPageData(data) {
	return request({
		url: '/work-order/page',
		method: 'post',
		data
	})
}
export function getWorkOrderDetailById(id) {
	return request({
		url: `/work-order/find?id=${id}`,
		method: 'get',
	})
}
export function getOverhaulPageData(data) {
	return request({
		url: '/work-order/page',
		method: 'post',
		data
	})
}
export function getOverhaulDetailById(data) {
	return request({
		url: '/evo-ims-overhaul/work-order/page',
		method: 'post',
		data
	})
}
export function getIssuePageList(data) {
	return request({
		url: '/evo-ims-overhaul/work-order/page',
		method: 'post',
		data
	})
}