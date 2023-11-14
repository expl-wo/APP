import {saveAppMenuPrivilege, getAppMenuPrivilege, 
	saveAppBtnPrivilege, getAppBtnPrivilege} from '@/utils/storage.js'

//遍历数组
export function bianliShuzu(list,code,showList,codeList) {
	let showListNew = showList
	list.forEach(item => {
		if (item.code == code) {
			showListNew =showList; showList[codeList.indexOf(code)] = true
		}else if (item.sub.length > 0) {
			bianliShuzu(item.sub,code,showListNew,codeList)
		}
	})
	return showListNew
}


export function hasPrivilege(code){
	let menuList = getAppMenuPrivilege();
	let findItem = menuList.find(item => {
		return item.code == code;
	})
	return !!findItem;
}

function transformTreeToList(treeList, menuArrList, btnCodeArrList){
	treeList.forEach(item=>{
		const {sub, ...params} = item;
		if(params.type == 1){//是菜单
			menuArrList.push(params);
		}else if(params.type == 2){ //是按钮
			btnCodeArrList.push(params.code);
		}
		if(sub && sub.length > 0){
			transformTreeToList(sub, menuArrList, btnCodeArrList);
		}
	})
}

export function savePermission(treeList){
	let menuArrList =  [], btnCodeArrList = [];
	transformTreeToList(treeList, menuArrList, btnCodeArrList);
	saveAppMenuPrivilege(menuArrList);
	saveAppBtnPrivilege(btnCodeArrList);
}

export function updateMenuVisible(menuList){
	let hasPrivilegeList = getAppMenuPrivilege();
	menuList.forEach(item=>{
		if(!item.ignoreJustice){ //如果不忽略
			item.show = hasPrivilege(hasPrivilegeList, item.code);
		}
		if(item.children && item.children.length > 0){
			updateMenuVisible(item.children);
		}
	})
}

export function initBtnPri(Vue){
  //检验是否有按钮权限
  Vue.prototype.isAuth = function(btnPrivilegeCode){
	  try{
		  let btnCodeList = getAppBtnPrivilege();
		  let index = btnCodeList.indexOf(btnPrivilegeCode);
		   return index >= 0;
	  }catch{
		  return false;
	  }
  }
}