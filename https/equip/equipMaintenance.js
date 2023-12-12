import request from '@/utils/request.js'

// 查询需要保养的所有设备
export function getDeviceMaintence(data) {
	// console.log(data)
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/mtcPlan',
			data: data,
			method: 'get'
		}).then(res => {
			resolve(res)
		})
	})
}

//查询某台设备的所有保养项
export function getDeviceMaintenceItems(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/opInit',
			data: data,
			method: 'get'
		}).then(res => {
			resolve(res)
		})
	})
}

//暂存保养记录
export function keepMaintenceRec(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/keepMtcRec',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}

//保养提交
export function maintenceSubmit(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/mtcSubmit',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}

//查询保养验收信息
export function getAcceptInfo(data) {
	// console.log("data：", data)
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/acceptInfo',
			data: data,
			method: 'get'
		}).then(res => {
			resolve(res)
		})
	})
}

//负责人扫描工牌二维码验收
export function acceptUser(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/acceptUser',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}

//验收完成
export function acceptFinish(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/acceptMtc',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}

//备品备件列表
export function sparePartList(data) {
	// console.log("data111:", data)
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/sparePart',
			data: data,
			method: 'get'
		}).then(res => {
			resolve(res)
		})
	})
}

//备品备件消耗保存
export function sparePartUse(data) {
	// console.log("data:", data);
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/sparePartUse',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}
export function sparePartUseRecord(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/equipment/eqpMtc/sparePartUseRecord',
			data: data,
			method: 'get'
		}).then(res => {
			resolve(res)
		})
	})
}
