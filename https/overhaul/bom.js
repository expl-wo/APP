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
		url: '/evo-ims-overhaul/bom-examine/page',
		method: 'post',
		data
	})
}
export function checkBom(data) {
	return request({
		url: '/evo-ims-overhaul/bom-examine/initiate',
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
// 批量绑定库位码
export function bindStationCode(data) {
    return request({
        url: '/evo-ims-overhaul/bom/update-station',
        method: 'post',
        data
    })
}
// 绑定流水库位码
export function bindSerialCode(data) {
    return request({
        url: '/evo-ims-overhaul/bom/update-child',
        method: 'post',
        data
    })
}