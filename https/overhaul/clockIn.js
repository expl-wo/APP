import request from '@/utils/request.js'

export function getSignInData(data) {
	return request({
		url: '/evo-ims-overhaul/clock-in/detail',
		method: 'post',
		data
	})
}
export function getProjectList(data) {
	return request({
		url: '/evo-ims-overhaul/clock-in/projects',
		method: 'post',
		data
	})
}
export function signIn(data) {
	return request({
		url: '/evo-ims-overhaul/clock-in/add',
		method: 'post',
		data
	})
}
// 获取通知列表
export function getMessageList(data) {
	return request({
		url: '/evo-ims-overhaul/person-center/notice/page',
		method: 'post',
		data
	})
}
