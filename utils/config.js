import {
	getNetTypeInfo,
} from '@/utils/storage.js';

import {
	getToken,
	getFormalData,
} from '@/utils/auth.js'

const isTest = true;

const formalUrl = 'http://dqmes.tbea-hb.com.cn/'

//正式服务器地址
let formalAjaxServerUrl = formalUrl+ 'api';

//测试服务器地址
let testlAjaxServerUrl = 'http://192.168.100.50/api';
//本地测试地址
let devTestlAjaxServerUrl = 'http://dqmes.tbea-hb.com.cn/api';

//正式服务器地址
let formalFileServerUrl = 'http://dqmes.tbea-hb.com.cn/minioServer/';

//测试服务器地址
let testlFileServerUrl = 'http://dqmes.tbea-hb.com.cn/minioServer/';


function getApkDownloadUrl(){
	return formalUrl;
}

function getAjaxUrl() {
	let isFormalVersion = getFormalData() === 'z' ? true : false;
	if (isFormalVersion) {
		return formalAjaxServerUrl;
	} else {
		if (process.env.NODE_ENV === 'development') {
			//如果是调试环境，返回本地地址
			return devTestlAjaxServerUrl;
		}else{
			return testlAjaxServerUrl;
		}
	}
}

function getFileServerUrl() {
	return isTest ? testlFileServerUrl : formalFileServerUrl;
}
export {
	getAjaxUrl,
	getApkDownloadUrl,
	getFileServerUrl
}