import {
	saveBizType,
	getBizType,
	saveBatchId,
	getBatchId,
	getAppConfig
} from '@/utils/storage.js';
import Constants from './constants.js'

//如果不是pda设备，就需要加上点击的描述
export function addClickScanlabel(label, isPdaDevice) {
	if (isPdaDevice) {
		return label;
	} else {
		if (label.indexOf('请') === 0) {
			return '请点击' + label.substr(label.indexOf('请') + 1);
		} else {
			return '点击' + label;
		}
	}
}

//判断一个字符串不是null undefined ''
export function isNotEmpty(str) {
	if (str !== null && str !== undefined && str.trim() != '') {
		return true;
	} else {
		return false;
	}
}

export function isNotEmptyObj(obj) {
	if (obj !== null && obj !== undefined && JSON.stringify(obj) !== '{}') {
		return true;
	} else {
		return false;
	}
}

export function isNotEmptyArr(obj){
	if (obj !== null && Array.isArray(obj) && obj.length > 0){
		return true;
	}else{
		return false;
	}
}

//从工牌二维码中截取到哈希值
export function getCardInfo(scan) {
	if (isNotEmpty(scan)) {
		if (scan.indexOf('PNO=') >= 0) {
			return scan.substr(scan.indexOf('PNO=') + 4);
		} else {
			return ''
		}
	} else {
		return ''
	}
}