import request from '@/utils/request.js'

// 浏览器获取访问文件的根路径
export function getCommonUrl() {
	return new Promise((resolve, reject) => {
		request({url: '/endpoint/comm/reso/rooturl', method: 'get'}).then(res =>{
			resolve(res)
		})
	})
}


//将图片前缀url保存起来
export function setCommonUrlStore(commonUrl) {
  return uni.setStorageSync('CommonUrlStr', commonUrl)
}
//获取图片前缀url
export function getCommonUrlStore() {
  return uni.getStorageSync('CommonUrlStr');
}


