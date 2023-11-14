import request from '@/utils/request.js'

export function getAprriaseTask(data) {
	return request({
		url: '/pbequipment/integrityAppraisal/getTaskList',
		method: 'get',
		data
	})
}
export function getTaskDetails(data) {
	return request({
		url: '/pbequipment/integrityAppraisal/getTaskDetails',
		method: 'get',
		data
	})
}
export function saveOrFinishTask(data) {
	return request({
		url: '/pbequipment/integrityAppraisal/saveOrFinishTask',
		method: 'post',
		data
	})
}