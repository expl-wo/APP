import {needUpVersion, getValueFromList} from './common.js'
import {getApkDownloadUrl} from './config.js'
import {getDictListByKey} from '@/components/xui/xui-dictionary/index.js'


async function startUpgradeApp(params){
	// #ifdef APP-PLUS
	if (process.env.NODE_ENV !== 'development') {
		let appConfigList = await getDictListByKey('appConfig', false, true);
		upgradeApp({
			version: getValueFromList(appConfigList, 'version'),
			downCompatibilityVersion: getValueFromList(appConfigList, 'version'),
			downloadUrl: '/d/last.apk',
			type: 'auto',
			...params
		});
	}
	// #endif
}

function  upgradeApp(item) {
	needUpVersion(item).then(result=>{
		let mustUpVersion = result.needUp;
		let widgetInfo = result.widgetInfo;
		console.log(widgetInfo);
		console.log(item);
		let param = {};
		if (widgetInfo.version != item.version) {
			param = {
				title: "检测到有版本更新!",
				content: "原版本：V"+widgetInfo.version+"\n"+"新版本：V"+item.version,
				canceltext: "暂不升级",
				oktext: "立即升级",
				flag: false
			};
			if(mustUpVersion){
				param = {
					title: "检测到有必须升级的新版本!",
					content: "原版本：V"+widgetInfo.version+"\n"+"新版本：V"+item.version,
					canceltext: "暂不升级",
					oktext: "立即升级",
					flag: false
				};
			}
		} else {
			param = {
				title: " 目前已经是最新版本！",
				content: "电气MES V" + item.version + '版',
				canceltext: "取消",
				oktext: "确定",
				flag: true
			};
			if(item.type === 'auto'){
				return;
			}
		}
		uni.showModal({
			title: param.title,
			content: param.content,
			showCancel: mustUpVersion ? false : true,
			confirmText: param.oktext,
			cancelText: param.canceltext,
			success: res => {
				if (!param.flag && res.confirm) {
					downloadAPK(item.downloadUrl);
				}
			}
		});
	})
}

function downloadAPK(url) {
	url = getApkDownloadUrl() + '/' + url;
	var dtask = plus.downloader.createDownload(
		url, {
			filename: "_downloads/"
		},
		function(d, status) {
			// 下载完成
			if (status == 200) {
				plus.runtime.install(d.filename, {
					force: true
				}, function() {
					//进行重新启动;
					plus.runtime.restart();
				}, (e) => {
					uni.showToast({
						title: '安装升级包失败:' + JSON.stringify(e),
						icon: 'none'
					})
				});
			} else {
				uni.showToast({
					title: '下载升级包失败，请手动去站点下载安装，错误码:' + status,
					icon: 'none'
				})
			}
		});

	let view = new plus.nativeObj.View("maskView", {
		backgroundColor: "rgba(0,0,0,.6)",
		left: ((plus.screen.resolutionWidth / 2) - 45) +
			"px",
		bottom: "80px",
		width: "90px",
		height: "30px"
	})

	view.drawText('开始下载', {}, {
		size: '12px',
		color: '#FFFFFF'
	});

	view.show()


	dtask.addEventListener("statechanged", (e) => {
		if (e && e.downloadedSize > 0) {
			let jindu = ((e.downloadedSize / e.totalSize) *
				100).toFixed(2)
			view.reset();
			view.drawText('进度:' + jindu + '%', {}, {
				size: '12px',
				color: '#FFFFFF'
			});
		}
	}, false);
	dtask.start();
}

export default {
	upgradeApp,
	startUpgradeApp
}
