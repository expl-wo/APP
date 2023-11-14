import request from '@/utils/request.js'

//设备维修列表查询

export function getNeedRepairList(data) {
	return request({
		url: '/pbequipment/eqpRepair/list',
		method: 'get',
		data
	})
}

//设备维修扫码后去向
export function chooseOneDeviceTo(data) {
	return request({
		url: '/pbequipment/eqpRepair/eqpRepTo',
		method: 'get',
		data
	})
}


//维修响应界面初始化
export function getNeedRepairInit(data) {
	return request({
		url: '/pbequipment/eqpRepair/respInit',
		method: 'get',
		data
	})
}
//维修响应提交
export function responseSubmit(data) {
	return request({
		url: '/pbequipment/eqpRepair/respSubmit',
		method: 'post',
		data
	})
}
//维修介入
export function secondRepairInvolve(data) {
	return request({
		url: '/pbequipment/eqpRepair/repInvolve',
		method: 'post',
		data
	})
}

//维修操作界面初始化
export function getDoRepairInit(data) {
	return request({
		url: '/pbequipment/eqpRepair/doRepInit',
		method: 'get',
		data
	})
}
//维修中等待备件开始
export function waitSt(data) {
	return request({
		url: '/pbequipment/eqpRepair/waitSt',
		method: 'post',
		data
	})
}
//维修中等待备件结束
export function waitEd(data) {
	return request({
		url: '/pbequipment/eqpRepair/waitEd',
		method: 'post',
		data
	})
}
//维修完成提交
export function repairSubmit(data) {
	return request({
		url: '/pbequipment/eqpRepair/repSubmit',
		method: 'post',
		data
	})
}
//维修开始
export function repairSt(data) {
	return request({
		url: '/pbequipment/eqpRepair/repairSt',
		method: 'post',
		data
	})
}
//维修信息保存
export function repairSave(data) {
	return request({
		url: '/pbequipment/eqpRepair/repSave',
		method: 'post',
		data
	})
}
