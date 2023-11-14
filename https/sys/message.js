import request from '@/utils/request.js'

/**
 * https://www.showdoc.com.cn/meswd?page_id=5929452416403061
 * /my/msg/list
 * GET
 * 按创建时间倒序个人消息列表查询
 */
export function queryMsgList(params){
	return new Promise((resolve,reject)=>{
		request({
			url:`/app/my/msg/list?pg_pagesize=${params.pg_pagesize}&pg_pagenum=${params.pg_pagenum}&status=${params.status}`,
			method:'get',
		}).then(res=>{
			resolve(res)
		})
	})
};	

/**
 * /my/msg/read
 * https://www.showdoc.com.cn/meswd?page_id=5929863798391118
 * 将 个人消息 变更为已读
 * POST
 */
export function msgRead(data) {
	return new Promise((resolve, reject) => {
		request({url: '/app/my/msg/read', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

/**
 * https://www.showdoc.com.cn/meswd?page_id=5930342137612576
 * POST
 * 根据ID 删除 个人消息
 * /my/msg/del
 */
export function msgDel(data) {
	return new Promise((resolve, reject) => {
		request({url: '/app/my/msg/del', data: data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}