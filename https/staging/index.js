import request from '@/utils/request.js'

// 获取工单列表，勘查工单workOrderType-1 ， 检修工单workOrderType-2
export function getWorkOrderPageData(data) {
	return request({
		url: '/evo-ims-overhaul/work-order/page',
		method: 'post',
		data
	})
}
// 获取工单详情
export function getWorkOrderDetailById(id) {
	return request({
		url: `/evo-ims-overhaul/work-order/find?id=${id}`,
		method: 'get',
	})
}
// 获取工序列表
export function getProcessList(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/page-info',
		method: 'post',
		data
	})
}
// 获取单个工序详情
export function getProcessDetail(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/bind-info',
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
		url: `/evo-ims-overhaul/work-content-mes/query?craftId=${data.craftId}`,
		method: 'get',
		data
	})
}

// 上报工作内容
export function setMesWorkContent(data) {
	return request({
		url: `/evo-ims-overhaul/work-content-mes/query?craftId=${data.craftId}`,
		method: 'get',
		data
	})
}

// 查询已填写工作内容
export function queryWorkContent(data) {
	return request({
		url: "/evo-ims-overhaul/work-content/query",
		method: 'post',
		data
	})
}

// 批量查询已填写工作内容
export function queryBatchRecord(data) {
	return request({
		url: "/evo-ims-overhaul/work-content/query-batch",
		method: 'post',
		data
	})
}
// 上报工作内容
export function reportWorkContent(data) {
	return request({
		url: "/evo-ims-overhaul/work-content/report",
		method: 'post',
		data
	})
}
// 查看操作项已填报时间
export function queryHistoryRecordByTime(data) {
	return request({
		url: "/evo-ims-overhaul/work-content/query-time",
		method: 'post',
		data
	})
}

// 开工、完工接口
export function reportWorderStatus(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure/report-status",
		method: 'post',
		data
	})
}

// 报工接口
export function reportWork(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure/report",
		method: 'post',
		data
	})
}

// 获取问题页面
export function getIssuePageList(data) {
	return request({
		url: "/evo-ims-overhaul/problem-base/page",
		method: 'post',
		data
	})
}

// 审核确认接口
export function proveConfirmApi(data) {
	return request({
		url: "/work-procedure/check",
		method: 'post',
		data
	})
}