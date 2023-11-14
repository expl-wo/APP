import request from '@/utils/request.js'
import {
	myInfo
} from '@/https/sys/permission.js'
import constants from '@/utils/constants.js'
import {setToken,removeToken,setUserInfo,setCurrRole,setUserRoleList} from '@/utils/auth.js'

const url = {
	//登录
	login: '/auth/jwt/token',
	loginScanCode: '/auth/jwt/tokenScanCode',
}

function dealLogin(response, resolve){
	if (response.code === constants.status.success) {
		setToken(response.data.accessToken);
		myInfo().then(infoResponse => {
			if (infoResponse.err_code === constants.status.success2) {
				if(!infoResponse.data.currRole || !infoResponse.data.roles || infoResponse.data.roles.length === 0){
					removeToken();
					resolve({
						err_code: 40001,
						err_msg: '该用户未授予角色权限，请联系管理员'
					});
					return;
				}
				infoResponse.data.accessToken = response.data.accessToken;
				infoResponse.data.userInfo = response.data.userInfo;
				setUserInfo(infoResponse.data.userInfo)
				setUserRoleList(infoResponse.data.roles);
				let selectedRole = infoResponse.data.roles.find(item=>{
					return item.id === infoResponse.data.currRole.k;
				})
				if(selectedRole){
					setCurrRole(selectedRole);	
				}else{
					let currRole = infoResponse.data.currRole;
					setCurrRole({
						id: currRole.k,
						roleName: currRole.v
					});
				}
			}
			resolve(infoResponse);
		}).catch(() => {
			resolve({
				err_code: 40001,
				err_msg: '接口异常'
			});
		})
	} else {
		resolve({
			err_code: 40001,
			err_msg: response.msg
		})
	}
}

export function login(data) {
	return new Promise((resolve, reject) => {
		request({
			url: url.login,
			method: 'post',
			data: data
		}).then(response => {
			dealLogin(response, resolve);
		}).catch(() => {
			resolve({
				err_code: 40001,
				err_msg: '接口异常'
			});
		})
	});
}

export function loginScanCode(data) {
	return new Promise((resolve, reject) => {
		request({
			url: url.loginScanCode,
			method: 'post',
			data: data
		}).then(response => {
			dealLogin(response, resolve);
		}).catch(() => {
			resolve({
				err_code: 40001,
				err_msg: '接口异常'
			});
		})
	});
}

export function updateWorkcard(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/app/my/updateWorkcard',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}

//绑定NFC
export function BindNFC(data) {
	return new Promise((resolve, reject) => {
		request({
			url: '/app/my/card',
			data: data,
			method: 'post'
		}).then(res => {
			resolve(res)
		})
	})
}