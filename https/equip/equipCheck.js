import request from '@/utils/request.js'

// 查询未绑定产线工位点检任务
export function getOtherSpotCheckList(data) {
	return request({
		url: '/pbequipment/equipCheck/othercheck',
		method: 'get',
		data
	})
}
export function getProSpotCheckList(data) {
	return request({
		url: '/pbequipment/equipCheck/proCheck',
		method: 'get',
		data
	})
}
//查询某台设备的所有点检项
export function getSpotCheckItems(data) {
	return request({
		url: '/pbequipment/equipCheck/opInit',
		method: 'get',
		data
	})
}

//点检提交
export function spotCheckSubmit(data) {
	return request({
		url: '/pbequipment/equipCheck/checkSubmit',
		method: 'post',
		data
	})
}

//暂存点检记录
export function keepCheckRec(data) {
	return request({
		url: '/pbequipment/equipCheck/keepCheckRec',
		method: 'post',
		data
	})
}