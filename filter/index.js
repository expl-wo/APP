/**
 * 如果为空 null 显示为0
 */
 function nullToZero(val){
	 if( val === undefined || val === null || val === ''){
		 return 0;
	 }else{
		 return val;
	 }
}


function substrTime(val){
	if(val && val.length > 10){
		return val.substr(0, 10);
	}else{
		return val;
	}
}

function filterInstall(Vue){
	Vue.filter('nullToZero',nullToZero)//插入过滤器名和对应方法
	Vue.filter('substrTime',substrTime)//插入过滤器名和对应方法
}


export default filterInstall