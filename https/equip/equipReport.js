import request from '@/utils/request.js'
// 查询本人报修的所有设备
export function getDeviceRepair(data) {
	return request({
		url: '/equipment/eqpRepair/infoById',
		method: 'get',
		data
	})
}

//设备报修和预约维修初始化-查询设备和故障类型信息
export function getRepairInit() {
	return request({
		url: '/equipment/eqpRepair/reportInit',
		method: 'get'
	})
}
//设备报修和预约维修-提交报修单
export function submitRepair(data) {
	return request({
		url: '/equipment/eqpRepair/report',
		method: 'post',
		data
	})
}


//维修完成确认界面初始化
export function confirmRepairInit(data) {
	return request({
		url: '/equipment/eqpRepair/confirm',
		method: 'get',
		data
	})
}
//设备维修确认提交
export function confirmRepairSubmit(data) {
	return request({
		url: '/equipment/eqpRepair/confirm',
		method: 'post',
		data
	})
}
/**
 * https://www.showdoc.com.cn/meswd?page_id=5454371455546510
 * /eqpLedger/eqpClazz
 * 故障分类查询
 * GET
 */
export function getEqpClass(data) {
	return request({
		url: '/equipment/eqpLedger/eqpClazz',
		method: 'get',
		data
	})
}
/**
 * https://www.showdoc.com.cn/meswd?page_id=5969299600850840
 * /eqpLedger/idNameByClazz
 * GET
 * 设备按分类查询id和名称
 */
export function getEqpByClass(data) {
	return request({
		url: '/equipment/eqpLedger/idNameByClazz',
		method: 'get',
		data
	})
}

export function getRepairMans(data) {
	return request({
		url: '/equipment/eqpRepair/repairMan',
		method: 'get',
		data
	})
}

export function getEqpinfo(params) {
	return request({
		url: '/equipment/eqpLedger/eqpInfo',
		method: 'get',
		data
	})
}

export function queryEqpList(data) {
	return request({
		url: '/equipment/eqpLedger/info',
		method: 'get',
		data
	})
}