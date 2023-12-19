
import request from '@/utils/request.js'
// Andon管理

/**
 * @param {Object} params
 * 获取 Andon 分类
 * /andonConfig/cate
 * https://www.showdoc.com.cn/meswd?page_id=5225455380138493
 */
export function getCateList(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/cate/query', data: data, method: 'GET'}).then(res =>{
			resolve(res)
		})
	})
}

/**
 * @param {Object} data
 * 异常项的分页查询
 * https://www.showdoc.com.cn/meswd?page_id=5294504317723445
 * /andonConfig/abnormal
 * GET
 */
export function getAbnormalList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/abnormal/queryAll?cateId=${params.cateId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * @param {Object} data
 * 设备的分页查询
 * name 	否 	string 	模糊匹配，设备名称
 * number 	否 	string 	模糊匹配，设备编号
 * usingDepartment 	否 	string 	模糊匹配，使用部门
 * status 	否 	string 	模糊匹配，使用状态，枚举
 * GET
 */
export function getEqpLedgerinfoList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/equipment/eqpLedger/info?pg_pagesize=${params.pg_pagesize}&pg_pagenum=${params.pg_pagenum}&name=${params.name}&number=${params.number}&usingDepartment=${params.usingDepartment}&status=${params.status}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}


/**
 * @param {Object} data
 * 产线查询
 * GET
 */
export function getProductLineList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/gcplan/baseData/productLine`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * @param {Object} data
 * 工位查询
 * GET
 */
export function getWorkspaceAndExamList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/gcplan/baseData/workspaceAndExam?productLineId=${params.productLineId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

// 异常项响应人员查询
export function getAbnormalResponderList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/responder/query?abnormalId=${params.abnormalId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

// andon触发
export function andonTriggerPost(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/trigger/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

export function andonInteractiveCheck(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/qualityAndon/commitAndon', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

/**
 * 待响应问题查询
 ***/
export function getResponseList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/responseList/query`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * 待解决问题查询
 ***/
export function getSolveList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/solveList/query`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}


// andon响应
export function andonResponsePost(data,tmpToken) {
	console.log(tmpToken)
	return new Promise((resolve, reject) => {
		request({url: '/andon/response/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

// andon解决
export function andonSolvePost(data,tmpToken) {
	console.log(tmpToken)
	return new Promise((resolve, reject) => {
		request({url: '/andon/solve/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}


/**
 * 单条触发问题处理查询
 ***/
export function getTriggerHandleList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/responseList/detail?&id=${params.id}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

// andon转办
export function andonTransferPost(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/transfer/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

// andon驳回
export function andonRejectPost(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/reject/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

/**
 * 已提报问题查询
 ***/
export function getTriggerList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/triggerList/query?status=${params.status}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * 班组、部门已提报问题查询
 ***/
export function getClazzTriggerList(){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/clazzList/query`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

// andon关闭
export function andonTriggerClosePost(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/close/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}



/**
 * 条件搜索查询设备列表
 ***/
export function getAllEquipList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/equipment/eqpCommon/eqpInit?id=${params.eqpNum}&eqpName=${params.eqpName}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}



/**
 * /andonTrigger/picture
 * https://www.showdoc.com.cn/meswd?page_id=5418148158032732
 * GET
 * 查询图片地址
 */

export function getPic(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/triggerPicture/query?&triggerId=${params.triggerId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * /andonTrigger/picture
 * https://www.showdoc.com.cn/meswd?page_id=5418148158032732
 * GET
 * 查询问题解决图片地址
 */
export function getSolvePic(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/triggerSolvePicture/getSolvePic?&triggerId=${params.triggerId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}



/**
 * GET
 * 生产号
 */
export function getProductNo(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/gcplan/plan/proplan/getProductData?searchKey=${params.searchKey}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

export function productNode(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/gcplan/plan/proplan/productNode?productNo=${params.productNo}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * GET
 * 工序
 */
export function getOp(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/gcplan/plan/proplan/getOpData?orderId=${params.orderId}&productPlanNodeId=${params.productPlanNodeId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}
/**
 * 手动升级提醒
 */
export function upLevel(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/up/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

export function findAbnormalByAdID(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`andon/abnormal/findAbnormalByAdID?abnormalId=${params.id}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/** 查询部门人员信息*/
export function findDepartmentPersons(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/pbpermissions/userInfo/getDepartmentPersons?searchKey=${params.searchKey}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

/**
 * 安灯指派
 */
export function assign(data) {
	return new Promise((resolve, reject) => {
		request({url: '/andon/assign/save', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

/**
 * 获取工序负责人
 */
export function getOpUser(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/processManager/getProcessManager?processNodeId=${params.processNodeId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

export function findAbnormal(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/qualityAndon/findAbnormal`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

export function getBaseInfo(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/andon/qualityAndon/getBaseInfo?issueRecordId=${params.issueRecordId}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}

// 获取部门信息
export function getOrgInfo(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/pbpermissions/org/query?name=${params.name}`,
			method:'GET'
		}).then(res=>{
			resolve(res)
		})
	})
}



