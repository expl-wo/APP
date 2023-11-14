//通用变量
export default {
	//请求返回
	status: {
		success: 200, //成功
		success2: 10000
	},
	//图片预览地址
	imagePreUrl: 'http://10.16.9.92/',
	dataLoadingTitle: '数据加载中...',
	//加载更多
	loadmore: 'loadmore',
	//加载中
	loading: 'loading',
	//没有更多了
	nomore: 'nomore',
	//toast duration
	duration: 1500,
	qualityCheckType: {
		SelfCheck: 'SelfCheck',
		InitialCheck: 'InitialCheck',
		SpecialCheck: 'SpecialCheck'
	},
	checkStatus: {
		UnknownCheck: -1, //"未知检验项
		SelfCheck: 0, //需自检
		Initial: 1, //需兼检
		Special: 2, //需专检
		NoCheck: 3, //无检查
		Finish: 4 //已检查
	},
	flag: {
		y: 'y',
		n: 'n'
	},
	flagChs: {
		y: '是',
		n: '否'
	},
	//版本
	version: '1.0',
	//isread	已读：1，未读：0，全部：''
	message: {
		alreadyRead: '1',
		unRead: '0',
		all: ''
	},
	netType: {
		'in': '内网',
		'out': '公网'
	},
	noData: '暂无数据',

	isNullOrEmpty: (data) => {
		if (data === null || data === undefined) {
			return true;
		}
		if (typeof(data) == 'string' && data.trim() == '') {
			return true;
		}
	},
	isEmpty(content) {
		if (content === null || content === undefined || content === '') {
			return true
		} else {
			return false
		}
	},
	isNotEmpty(content) {
		if (content === null || content === undefined || content === '') {
			return false
		} else {
			return true
		}
	},
	//是否为空对象
	isEmptyObj(obj) {
		if (obj === null || obj === undefined) {
			return true
		}
		for (let key in obj) {
			return false
		}
		return true
	}
}