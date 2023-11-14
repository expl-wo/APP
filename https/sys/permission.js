import request from '@/utils/request.js'

const url = {
	//个人信息
	myInfo: '/pbpermissions/my/info',
	//获取权限
	currperm: '/pbpermissions/my/currperm',
	//切换角色
	chgcurrrole: '/pbpermissions/my/chgcurrrole',

	//绑定工牌
	bindingGpId: '/pbpermissions/userInfo/bindingGpId',
	//解绑
	unbindingGpId: '/pbpermissions/userInfo/unbindingGpId',
	//获取二维码信息
	getBindingInfo: '/pbpermissions/userInfo/getBindingInfo',
	lineWorkSpace: '/pbproduction/workSpace/lineWorkSpace',
}

export function bindingGpId(data) {
	return request({
		url: url.bindingGpId,
		method: 'post',
		data
	})
}

export function unbindingGpId(data) {
	return request({
		url: url.unbindingGpId,
		method: 'post',
		data
	})
}

export function getBindingInfo(data) {
	return request({
		url: url.getBindingInfo,
		method: 'get',
		data
	})
}

export function myInfo(data) {
	return request({
		url: url.myInfo,
		method: 'get',
		data
	})
}

export function lineWorkSpace() {
	return request({
		url: url.lineWorkSpace,
		method: 'get'
	})
}

export function currperm(data) {
	return request({
		url: url.currperm,
		method: 'get',
		data
	})
}


export function chgcurrrole(data) {
	return request({
		url: url.chgcurrrole,
		method: 'post',
		data
	})
}