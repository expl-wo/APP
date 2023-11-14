import request from '@/utils/request.js'
// 工序类型
export function findLineSteps() {
	return request({
		url: '/pbproduction/workSpace/findLineSteps',
		method: 'get'
	})
}
// 工序类型
export function findInstanceByWork(params) {
	return request({
		url: '/pbproduction/workSpace/findInstanceByWork',
		method: 'get',
		data: {
			workSpaceId: params.workspaceId
		}
	})
}
export function changeWorkspace(data) {
	return request({
		url: '/pbproduction/workSpace/changeWorkspace',
		method: 'post',
		data
	})
}
export function getOpTask(data) {
	return request({
		url: '/pbproduction/productTask/getTaskList',
		method: 'get',
		data
	})
}
export function getDrawingBom(data) {
  return request({
    url: '/pbproduction/productTask/getDrawingBom',
    method: 'get',
    data
  })
}
export function getBomByDrawingNo(data) {
  return request({
    url: '/scheduling/plm/getBomByDrawingNo',
    method: 'get',
	data
  })
}
export function opStart(data) {
	return request({
		url: '/pbproduction/productStart/opBatchStart',
		method: 'post',
		data
	})
}
export function opReport(data) {
	return request({
		url: '/pbproduction/productReport/productReport',
		method: 'post',
		data
	})
}
export function opStop(data) {
	return request({
		url: '/pbproduction/productReport/pause',
		method: 'get',
		data
	})
}
export function opRestart(data) {
	return request({
		url: '/pbproduction/productReport/restart',
		method: 'get',
		data
	})
}
export function opFinish(data) {
	return request({
		url: '/pbproduction/productReport/productFinish',
		method: 'post',
		data
	})
}

export function getPauseReason() {
	return request({
		url: '/pbproduction/stopReason/getList',
		method: 'get'	
	})
}


//查询用户所在小组成员信息
export function queryTeamMember(data) {
	return request({
		url: '/pbproduction/teamwork/queryTeamUser',
		method: 'get',
		data
	})
}

//查询用户所在班组成员信息
export function queryClazzMember(data) {
	return request({
		url: '/pbproduction/teamwork/teamPerson',
		method: 'get',
		data
	})
}
export function getOpInfo(params) {
	return request({
		url: '/pbproduction/productTask/getOpInfo?opPlanId='+params.opPlanId,
		method: 'get'		
	})
}

export function getCheckInfo(params) {
	return request({
		url: '/pbproduction/productTask/getCheckInfo?opPlanId='+params.opPlanId,
		method: 'get'		
	})
}
export function getLastProcedure(data){
	return request({
		url: '/pbproduction/productTask/getLastProcedure',
		method: 'get',
		data
	})
}

export function lineWork(){
	return request({
		url: '/pbproduction/workSpace/lineWorkSpace',
		method: 'get'
	})
}
/**
 * https://www.showdoc.com.cn/meswd?page_id=5803357991765882
 * /materialCheck
 * 开工前工序物料是否齐套检查
 * GET
 */
// export function checkMaterial(data){
// 	return request({
// 		url: '/scheduling/materialCheck',
// 		method: 'get',
// 		data
// 	})
// };
export function getBom(data) {
  return request({
    url: '/pbplan/production/getBom',
    method: 'get',
    data
  })
}
export function getOpKeyMaterial(data) {
  return request({
    url: '/pbproduction/opKeyMaterial/findOpKeyMaterial',
    method: 'get',
    data
  })
}
export function addOrEditOpKeyMaterial(data) {
  return request({
    url: '/pbproduction/opKeyMaterial/addOrEditOpKeyMaterial',
    method: 'post',
    data
  })
}
export function delOpKeyMaterial(data) {
  return request({
    url: '/pbproduction/opKeyMaterial/delOpKeyMaterial',
    method: 'post',
    data
  })
}

//添加物料
export function addMaterial(data) {
  return request({
    url: '/pbproduction/scan/addParts',
    method: 'POST',
    data
  })
}