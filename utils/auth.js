const TokenKey = 'hb_dq_mes_uniapp_token'

const UserInfoKey = 'hb_dq_mes_user_info'

const FormalKey = 'hb_dq_mes_formalKey'

const UserRoleKey = 'hb_dq_mes_userRoleKey'

const CurrRoleKey = 'hb_dq_mes_currRoleKey'

//c 测试环境 z正式环境
export function getFormalData() {
	let data = uni.getStorageSync(FormalKey);
	return data !== 'c' ? 'z' : 'c'
}

export function setFormalData(formal) {
	return uni.setStorageSync(FormalKey, formal);
}

export function getToken() {
	return uni.getStorageSync(TokenKey);
}

export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}


export function getUserInfo() {
	try{
		let str = uni.getStorageSync(UserInfoKey);
		return JSON.parse(str);
	}catch{
		return {};
	}
}

export function setUserInfo(userInfo) {
	let str = JSON.stringify(userInfo);
	return uni.setStorageSync(UserInfoKey, str)
}

export function removeUserInfo() {
	return uni.removeStorageSync(UserInfoKey)
}

export function setUserRoleList(userList) {
	let userListString = JSON.stringify(userList);
	return uni.setStorageSync(UserRoleKey, userListString);
}

export function getUserRoleList() {
	try{
		let userListString = uni.getStorageSync(UserRoleKey);
		return JSON.parse(userListString);
	}catch{
		return [];
	}
}

export function setCurrRole(roleInfo){
	let roleInfoString = JSON.stringify(roleInfo);
	return uni.setStorageSync(CurrRoleKey, roleInfoString)
}

export function getCurrRole(){
	try{
		let roleInfoString = uni.getStorageSync(CurrRoleKey);
		return JSON.parse(roleInfoString);
	}catch{
		return {};
	}
}