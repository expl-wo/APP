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
// 获取设备清单列表
export function getDeviceList(data) {
	return request({
		url: '/evo-ims-overhaul/middle-big-equipment/query-use',
		method: 'post',
		data
	})
}
// 获取材料清单列表
export function getMaterialList(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/material-page-info',
		method: 'post',
		data
	})
}
// 获取工装工具清单数据
export function getToolList(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/tool-info',
		method: 'post',
		data
	})
}
// 修改工器具数量
export function toolNumChange(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/change-tool-num',
		method: 'post',
		data
	})
}
// 修改材料数量
export function materialNumChange(data) {
	return request({
		url: '/evo-ims-overhaul/work-procedure/change-material-num',
		method: 'post',
		data
	})
}