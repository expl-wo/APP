import constants from '@/utils/constants.js'

// 时间转换 YYYY-MM-DD
export function timeTranslate(dateValue) {
	var date = dateValue ? new Date(dateValue) : new Date()
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	// var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	//     + " " + date.getHours() + seperator2 + date.getMinutes()
	//     + seperator2 + date.getSeconds();
	return currentdate;
}

// 确认提示框
export function $confirm(mes) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: mes,
			success: function(res) {
				if (res.confirm) {
					resolve()
				} else {
					uni.showToast({
						icon: 'none',
						title: '已取消',
						duration: 1000
					});
				}
			}
		});
	})
}


export function isEmptyObj(obj) {
	return JSON.stringify(obj) == "{}";
}


// 消息提示 3秒隐藏
export function $message(mes) {
	setTimeout(function() {
		uni.showToast({
			icon: 'none',
			title: mes,
			duration: 3000
		});
	}, 100)
}

//获取版本
export function getVersion() {
	// #ifndef APP-PLUS
	//constants.version
	return '';
	// #endif
	// #ifdef APP-PLUS
	if (process.env.NODE_ENV === 'development') {
		return constants.version;
	} else {
		return plus.runtime.version
	}
	// #endif
}


export function getValueFromList(list, code) {
	let item = list.find(item => {
		return item.code === code;
	})
	if (item) {
		return item.name;
	} else {
		return ''
	}
}


//获取版本描述
export function getVersionDesc() {
	let isFormalVersion = getFormalData() ==='z' ? true : false;
	let version = getVersion();
	version = getVersionItem(isFormalVersion, version).label;
	return version;
}

//获取版本详情
export function getVersionItem(type, version) {
	if (version) {
		version = 'V' + version
	}
	if (type) {
		return {
			type: constants.flag.y,
			label: '正式版' + version
		}
	} else {
		return {
			type: constants.flag.n,
			label: '测试版' + version
		}
	}
}

export function needUpVersion(item) {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		try {
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				let mustUpVersion = isMustUp(item, widgetInfo.version);
				resolve({
					needUp: mustUpVersion,
					widgetInfo
				})
			})
		} catch (e) {
			console.error(e);
			resolve({
				needUp: false,
				widgetInfo: {}
			})
		}
		// #endif
		// #ifndef APP-PLUS
		resolve({
			needUp: false,
			widgetInfo: {}
		})
		//#endif
	})
}



//监测是否必须强制升级
function isMustUp(item, nowVersion) {
	try {
		let downVersion = item.downCompatibilityVersion;
		//如果为空，说明不需要强制升级
		if (!downVersion) {
			return false;
		}
		let downVersionArr = downVersion.split('.');
		let nowVersionArr = nowVersion.split('.');
		if (downVersionArr.length !== nowVersionArr.length) {
			return true;
		}
		let len = downVersionArr.length;
		let equalCount = 0;
		let needUpVersion = true;
		for (let i = 0; i < len; i++) {
			let mustItem = downVersionArr[i];
			let nowItem = nowVersionArr[i];
			console.error('mustItem' + mustItem)
			console.error('nowItem' + nowItem)
			if (parseInt(nowItem) > parseInt(mustItem)) { //当前版本遍历出现大于必须升级的版本，就不需要强制升级
				needUpVersion = false;
				break;
			} else if (parseInt(nowItem) === parseInt(mustItem)) {
				equalCount++;
			}
		}
		//说明版本相同，也不需要升级
		if (equalCount === len) {
			needUpVersion = false;
		}
		return needUpVersion;
	} catch (e) {
		console.error(e);
	}
}


export function getCardInfo(scan) {
	if (constants.isNotEmpty(scan)) {
		if (scan.indexOf('PNO=') >= 0) {
			return scan.substr(scan.indexOf('PNO=') + 4);
		} else {
			return ''
		}
	} else {
		return ''
	}
}
