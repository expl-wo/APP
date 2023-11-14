import request from '@/utils/request.js'
/**
 * https://www.showdoc.com.cn/meswd?page_id=5043930746356330
 * 获取本人当前所使用角色的权限集合
 * /my/currperm
 * GET
 */

export function getQuanxian(params){
	return new Promise((resolve,reject)=>{
		request({
			url:'/api/pbpermissions/my/currperm?&roleId=' + params ,
			method:'get',
		}).then(res=>{
			resolve(res)
		})
	})
};	

/**
 * https://www.showdoc.com.cn/meswd?page_id=5673963159484157
 * /my/chgcurrrole
 * POST
 * 切换当前用户的使用角色
 */

export function changeJuese(data) {
	return new Promise((resolve, reject) => {
		request({url: '/app/my/chgcurrrole', data:data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}

/** 外协账号申请*/
export function getWx(data) {
	return new Promise((resolve, reject) => {
		request({url: '/app/nonLocalPerson/add', data:data, method: 'post'}).then(res =>{
			resolve(res)
		})
	})
}
