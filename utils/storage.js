import constants from '@/utils/constants.js'
//是否接受新消息
const recevie_msg = 'slm_recevie_msg';

//是否是正式版本
const formal_version_flag = 'slm_formal_version_flag';

//用户信息列表
const user_info_list = 'slm_user_info_list';

//登录信息
const user_login_info = 'slm_user_login_info';


const menu_info = 'slm_menu_info';

const biz_type = 'biz_type';

const batch_id = 'batch_id';

const app_config = 'hb_dq_app_config';

const app_menu = 'hb_dq_app_menu';

const app_btn = 'hb_dq_app_btn';


//获取网络模式
const net_type = 'net_type';
	saveNetTypeInfo,
	getNetTypeInfo


// app参数配置
export function saveNetTypeInfo(params) {
	return uni.setStorageSync(net_type, params);
}
export function getNetTypeInfo() {
	return uni.getStorageSync(net_type);
}

export function saveAppMenuPrivilege(menuList){
	return uni.setStorageSync(app_menu, JSON.stringify(menuList));
}

export function getAppMenuPrivilege(){
	try{
		return JSON.parse(uni.getStorageSync(app_menu));
	}catch{
		return []
	}
}

export function saveAppBtnPrivilege(btnList){
	return uni.setStorageSync(app_btn, JSON.stringify(btnList));
}

export function getAppBtnPrivilege(){
	try{
		return JSON.parse(uni.getStorageSync(app_btn));
	}catch{
		return []
	}
}

// app参数配置
export function saveAppConfig(params) {
	return uni.setStorageSync(app_config, JSON.stringify(params));
}
export function getAppConfig() {
	return JSON.parse(uni.getStorageSync(app_config));
}

// 业务类型
export function saveBizType(params) {
	return uni.setStorageSync(biz_type, params);
}
export function getBizType() {
	return uni.getStorageSync(biz_type)
}

// 批次ID
export function saveBatchId(params) {
	return uni.setStorageSync(batch_id, params);
}
export function getBatchId() {
	return uni.getStorageSync(batch_id)
}


// 存储权限信息
export function saveMenuInfo(params) {
	return uni.setStorageSync(menu_info, JSON.stringify(params));
}
export function getMenuInfo() {
	let menuList = uni.getStorageSync(menu_info);
	if(menuList){
		return JSON.parse(menuList)
	}else{
		return []
	}
}

// 是否接受新消息
export function saveReceiveMsg(params) {
	return uni.setStorageSync(recevie_msg, params);
}
export function getReceiveMsg() {
	return uni.getStorageSync(recevie_msg)
}

//存储登录信息
export function saveUserLoginInfo(loginUserInfo){
	uni.setStorageSync(user_login_info, JSON.stringify(loginUserInfo));
}

//获取登录信息
export function getUserLoginInfo(){
	let userInfo = uni.getStorageSync(user_login_info);
	if(userInfo){
		return JSON.parse(userInfo)
	}else{
		return {}
	}
}

//存储历史登录信息
export function saveUserInfoList(userInfoObj) {
	let userInfoList = getUserInfoList();
	let index = -1;
	userInfoList.some((item, i) => {
		if (item.userName === userInfoObj.userName) {
			index = i;
			return true;
		} else {
			return false;
		}
	})
	if (index >= 0) {
		userInfoList.splice(index, 1);
	}
	userInfoList.unshift(userInfoObj);
	uni.setStorageSync(user_info_list, JSON.stringify(userInfoList));
}

//获取历史登录信息
export function getUserInfoList() {
	let userInfoList = [];
	let data = uni.getStorageSync(user_info_list);
	if (data) {
		userInfoList = JSON.parse(data);
	}
	return userInfoList;
}
