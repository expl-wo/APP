import request from '@/utils/request.js'



export function getCheckInfo(params) {
	return request({
		url: '/pbproduction/productTask/getCheckInfo?opPlanId='+params.opPlanId,
		method: 'get'		
	})
}
export function getTestByOpStand(data) {
	return request({
		url: '/pbquality/testtemp/getTestByOpStand',
		method: 'get',
		data
	})
}

export function disableTestRecord(data){
  return request({
    url: '/pbquality/testtemp/disableTestRecord',
    method: 'post',
    data
  })
}

export function saveTestRecordFill(data) {
	return request({
		url: '/pbquality/qualityToPro/saveTestRecordFill',
		method: 'post',
		data
	})
}

export function saveCheck(data) {
	return request({
		url: '/pbproduction/checkTask/saveCheck',
		method: 'post',
		data
	})
}

export function addEmptyTestRecord(data){
	return request({
		url: '/pbquality/testtemp/addEmptyTestRecord',
		method: 'post',
		data
	})
}

export function onCheckRestart(data) {
  return request({
    url: '/pbproduction/checkTask/checkRestart',
    method: 'get',
    data
  })
}

export function onSpecialEnsure(data) {
  return request({
    url: '/pbproduction/checkTask/scanCodeGetUser',
    method: 'get',
    data
  })
}
export function onSpecialEnsure2(data) {
  return request({
    url: '/pbproduction/checkTask/scanCodeGetUser2',
    method: 'post',
    data
  })
}

export function getSpChecherInfo(data){
  return request({
    url: '/admin/jwt/spLogin',
    method: 'post',
    data
  })
}