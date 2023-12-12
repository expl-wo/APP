import request from '@/utils/request.js'

export function getAprriaseTask(data) {
	return request({
		url: '/equipment/integrityAppraisal/getTaskList',
		method: 'get',
		data
	})
}
export function getTaskDetails(data) {
	return request({
		url: '/equipment/integrityAppraisal/getTaskDetails',
		method: 'get',
		data
	})
}
export function saveOrFinishTask(data) {
	return request({
		url: '/equipment/integrityAppraisal/saveOrFinishTask',
		method: 'post',
		data
	})
}