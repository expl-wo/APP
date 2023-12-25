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
		// data
		data: {
			queryList: data
		}
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
export function reportWorKOrderStatus(data) {
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
// export function getIssuePageList(data) {
// 	return request({
// 		url: "/evo-ims-overhaul/problem-base/page",
// 		method: 'post',
// 		data
// 	})
// }

// 审核确认接口
export function proveConfirmApi(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure/check",
		method: 'post',
		data
	})
}
// Andon分类查询
export function queryCategory(data) {
	return request({
		url: "/evo-ims-link/andon/query/category",
		method: 'get',
		data
	})
}
// 异常项查询
export function queryAbnormal(data) {
	return request({
		url: "/evo-ims-link/andon/query/abnormal",
		method: 'get',
		data
	})
}
// 安灯添加问题接口
export function addProcedureProblem(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure-problem/add",
		method: 'post',
		data
	})
}
// 分页查看问题
export function queryProcedureProblem(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure-problem/query-page",
		method: 'post',
		data
	})
}
// 查询工步签到签退
export function searchSignInfoApi(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure/query-execute-record",
		method: 'post',
		data
	})
}
// 保存签到签退时间
export function saveSignInfoApi(data) {
	return request({
		url: "/evo-ims-overhaul/work-procedure/execute-record-save",
		method: 'post',
		data
	})
}
// 按类型查询文档模板
export function searchTemplateList(data) {
	return request({
		url: `/evo-ims-overhaul/template-manage/query-by-type?type=${data.type}`,
		method: 'get',
		data
	})
}
// 根据id查看文档模板详情
export function searchStandardById(data) {
	return request({
		url: `/evo-ims-overhaul/template-manage/query-by-id?docId=${data.docId}`,
		method: 'get',
		data
	})
}
// 查询是否首次开工
export function isFirstTimeStart(params) {
	return request({
		url: `/evo-ims-overhaul/work-procedure/query-start-work`,
		method: 'post',
		data: params
	})
}