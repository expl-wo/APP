import request from '@/utils/request.js'
import {
		getUrl
	} from '@/utils/request.js'
const url = {
	//上传文件
	uploadFile: '/file/upload',
	//文件下载	 GET
	downloadFile: '/file/download/file',
	// 文件批量删除	 POST
	batchDeleteFile: '/file/delete/file',
	// 添加照片记录	POST
	insertUploadRecord: '/slm/photo/insert',
	//  查询照片	 GET
	queryFile: '/slm/photo/query',
	// 删除照片	 POST
	deleteFile: '/slm/photo/delete'
}


export default {
	downloadFile(params) {
		return request({
			url: url.downloadFile,
			method: 'get',
			data: params
		})
	},
	batchDeleteFile(params) {
		return request({
			url: url.batchDeleteFile,
			method: 'post',
			data: params
		})
	},
	insertUploadRecord(params) {
		return request({
			url: url.insertUploadRecord,
			method: 'post',
			data: params
		})
	},
	queryFile(params) {
		return request({
			url: url.queryFile,
			method: 'get',
			data: params
		})
	},
	deleteFile(params) {
		return request({
			url: url.deleteFile,
			method: 'post',
			data: params
		})
	},
	upload(params) {
		return new Promise((resolve, reject)=>{
			uni.uploadFile({
				//请求的url接口地址
				url: getUrl(url.uploadFile),
				fileType: 'image', //图片类型
				filePath: params.filePath, //哪张图片
				name: 'file', //对应接口的文件名称
				header: { //请求头
					'token': params.token
				},
				success: (res) => {
					if (res.statusCode === 200) {
						let photoInfo = res.data;
						let info = JSON.parse(photoInfo);
						resolve(info)
					}else{
						reject({
							status: 10040,
							msg: '文件上传失败'
						})
					}
				},
				fail: (err) => {
					reject({
						status: 10040,
						msg: '文件上传失败'
					})
				}
			})
		})
	},
}
