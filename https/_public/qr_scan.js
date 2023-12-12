import request from '@/utils/request.js'

/**
 * 扫码获取生产号
 * */
 export function getProductionCode(data) {
 	return new Promise((resolve, reject) => {
 		request({url: '/app/qrScan/findProductionCode', data: data,method: 'post'}).then(res =>{
 			resolve(res)
 		})
 	})
 }
 
 /**
  * 扫码获取生产号数据
  * */
  export function getProductionData(params) {
  	return new Promise((resolve, reject) => {
		request({
			url:'/app/qrScan/findData?productionCode='+params.productionCode,
			method:'get',
		}).then(res=>{
			resolve(res)
		})
  	})
  }
  
  /**
   * 扫码获取用户
   */ 
  export function getUserData(params) {
  	return new Promise((resolve, reject) => {
  		request({
  			url:'/pbpermissions/userInfo/getUserInfoByGpId',
  			method:'post',
			data:params
  		}).then(res=>{
  			resolve(res)
  		})
  	})
  }

  export function getUserInfos(params) {
  	return new Promise((resolve, reject) => {
  		request({
  			url:'/pbpermissions/UserInfos?userId='+params,
  			method:'get'
  		}).then(res=>{
  			resolve(res)
  		})
  	})
  }
  