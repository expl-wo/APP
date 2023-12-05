import request from '@/utils/request.js'

export function getBomDataList(data) {
	return request({
		url: '/evo-ims-overhaul',
		method: 'post',
		data
	})
}