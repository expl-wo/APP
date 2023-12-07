import request from '@/utils/request.js'

export function getBomDataList(data) {
	return request({
		url: '/evo-ims-overhaul/bom/query-list',
		method: 'post',
		data
	})
}
export function getReturnList(data) {
	return request({
		url: '/evo-ims-overhaul',
		method: 'post',
		data
	})
}
export function uploadFile(data) {
    return request({
        url: '/api/equipment/overHaulFile/api/file/upload',
        method: 'post',
        data
    })
}
// 上传图片
export function bindPic(data) {
    return request({
        url: '/evo-ims-overhaul/bom/update-child-img',
        method: 'post',
        data
    })
}