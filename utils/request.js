import {
	getToken,
	setToken,
	getUserInfo
} from '@/utils/auth.js'
import {
	getAjaxUrl
} from './config.js'

import constants from '@/utils/constants.js'
import loginHttp from '@/https/sys/login'

export function getUrl(url, source = '') {
	let baseUrl = getAjaxUrl();
	// #ifdef H5
	// baseUrl = url.indexOf('evo-ims-overhaul') > -1 ? '' : '/api';
	baseUrl = '/api';
	// #endif
	console.log('request ---' + baseUrl);
	return baseUrl + url;
}

/**
 * 提示信息
 */
function showMessage(message = "token过期，请重新登录") {
	uni.showToast({
		icon: 'none',
		title: message,
		duration: 2000
	});
}

/**
 * 提示信息并清空token，跳到登录页面
 */
function showMessageAndClearToken(message = 'token过期，请重新登录') {
	showMessage(message);
	setToken('')
	uni.showToast({
		icon: 'none',
		title: message,
		duration: 2000,
		complete: () => {
			uni.reLaunch({
				url: '/pages/login/login'
			})
		}
	})
}

const request = ({
	url,
	data,
	method,
	source = '',
	fromdata,
	format,
	moreParams = {},
	header = {
		'content-type': 'application/json'
	}
}) => {
	console.log(JSON.stringify(data))
	if (fromdata && fromdata == 'fromdata') { // from表单形式传参
		header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
	} else if (fromdata && fromdata == 'upload') { // 上传
		header['content-type'] = 'application/json'
	} else { // json
		header['content-type'] = 'application/json'
	}
	if (getToken()) {
		header['authorization'] = getToken()
	}
	if (url.indexOf('evo-ims-overhaul') > -1) {
		const userInfo = getUserInfo();
		if (userInfo.username) {
			// header['userId'] = userInfo.username;
			header['userId'] = "412104";
		}
	}
	return new Promise((resolve, reject) => {
		let requestUrl = getUrl(url, source);
		console.log(requestUrl);
		uni.request({
			url: requestUrl,
			data,
			method,
			header,
			...moreParams,
			success: (res) => {
				if (res.statusCode === 404) {
					uni.showToast({
						icon: 'none',
						title: '接口404错误，可能是后台服务异常',
						duration: 3000,
					})
					return;
				}
				//如果数据类型是
				if (moreParams.responseType === 'arraybuffer') {
					resolve(res)
				} else {
					if (res.statusCode === 401) {
						showMessageAndClearToken();
						return;
					}

					if (res.data.err_code && res.data.err_code != constants.status.success2) {
						if (res.data.err_msg.indexOf('过期') >= 0 || res.data.err_msg.indexOf(
								'未登录') >= 0 ||
							res.data.err_code === 401) {
							showMessageAndClearToken(res.data.err_msg)
						} else {
							resolve(res.data)
						}
					} else {
						console.log(res.data);
						resolve(res.data)
					}
				}
			},
			fail: (err) => {
				console.error(JSON.stringify(err));
				if (err && err.errMsg.indexOf('Failed to connect') >= 0) {
					showMessage('请在登录页选择正确的网络模式并重新登录');
				}
				reject(err)
			},
		})
	})
}
export default request;