<template>
	<view class="content ">
		<view class="">
			<view v-show="showList[4]">
				<image src="../../static/img/icon/sm.svg" class="img-size" mode="" @click="scanButtonClick"></image>
			</view>
			<view class="msg-size">
				{{msgSize}}
			</view>
			<u-icon @click="tapMsg" class="text-xl msg" size="50" name="bell-fill"></u-icon>
		</view>
		<view class="app-containerR app-containerWrap">
			<!-- 			<view v-show="showList[1]" class="group-warter my-item w-240 tc bg-cyan" @tap="jumpTap1()">
				<u-icon size="80" name="../../static/img/icon/shengChan.svg"></u-icon>
				<view class="group-title">生产管理</view>
			</view> -->
			<view v-show="showList[0]" class="group-warter my-item w-240 tc bg-blue" @tap="jumpTap2()">
				<u-icon class="text-xl" size="80" name="../../static/img/icon/pm_001.svg"></u-icon>
				<view class="group-title">Andon管理</view>
			</view>
			<view v-show="showList[2]" class="group-warter w-240 my-item tc bg-purple" @tap="jumpTap3()">
				<u-icon class="text-xl" size="80" name="../../static/img/icon/sheBei.svg"></u-icon>
				<view class="group-title">设备管理</view>
			</view>
			<!-- 			<view v-show="showList[3]" class="group-warter w-240 tc my-item bg-mauve" @tap="jumpTap4()">
				<u-icon class="text-xl s" size="80" name="../../static/img/icon/zhiLiang.svg"></u-icon>
				<view class="group-title">质量管理</view>
			</view> -->

			<view v-show="showList[4]" class="group-warter w-240 my-item tc bg-purple" @tap="jumpTap6()">
				<u-icon class="text-xl" size="80" name="../../static/img/icon/sheBei.svg"></u-icon>
				<view class="group-title">检修管理</view>
			</view>
		</view>

		<!--扫码弹窗-->
		<!-- 		<u-popup mode="top" :show="scanShow" @close="scanShow=false">
			<view class="app-containerC wp table-zdy">
				<view class="th-group">
					<view class="th">请点击屏幕上绿色按钮进行扫码操作</view>
				</view>
				<view class="td-group">
					<view class="td">
						<input class="uni-input" type="text" v-model="scanId" :focus="focus" @blur="focus=false" @input="scanNext" />
					</view>
				</view>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	import {
		getCommonUrl,
		setCommonUrlStore,
	} from '@/https/_public/common.js'
	import upgradeApp from '@/utils/upgrade.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getDictListByKey,
		transformDictDetail
	} from '@/components/xui/xui-dictionary/index.js'

	import {
		getToken,
		getUserInfo,
		setToken,
		setUserInfo,
		getCurrRole
	} from '@/utils/auth.js'
	import {
		hasPrivilege,
		savePermission
	} from '../../utils/quanxian.js'
	import {
		currperm,
		lineWorkSpace
	} from '@/https/sys/permission.js'
	import {
		getAppMenu,
		saveAppMenu
	} from '../../utils/storage.js'
	export default {
		data() {
			return {
				codeList: ['0703_Andon', '0702_production', '0701_equipment', '0704_quality', 'pad-saoMa1005'],
				showList: [false, false, false, false, true],
				msgSize: 0,
				timeoutObj: {},
				scanId: '',
				scanShow: false,
				focus: false,
				token: '',
				userId: ''
			}
		},
		onReady() {
			this.token = getToken()
			this.userId = getUserInfo().id;
			if (getToken() == '') {
				uni.reLaunch({
					url: '/pages/login/login',
				});
			}

		},
		created() {
			//刚开始就把展示图片的前缀URL保存起来
			// getCommonUrl().then(res => {
			// 	setCommonUrlStore(res.data)
			// })
		},
		mounted() {
			console.log("进入了主菜单");

		},
		methods: {
			// 生产
			jumpTap1() {
				uni.navigateTo({
					url: '/pages/production/index'
				});
			},
			// Andon
			jumpTap2() {
				uni.navigateTo({
					url: '/pages/andon/index',
				});
			},
			// 设备
			jumpTap3() {
				uni.navigateTo({
					url: '/pages/equip/index'
				});
			},
			//质量
			jumpTap4() {
				uni.navigateTo({
					url: '/pages/quality/index'
				});
			},
			// 检修
			jumpTap6() {
				uni.navigateTo({
					url: '/pages/staging/index'
					// url: '/pages/orderDetail/productionDetail/index'
					// url: `/pages/orderDetail/subProductionRowDetail/index`,
				});
			},
			tapMsg() {
				uni.navigateTo({
					url: '../user/message'
				})
			},
			tapScan() {
				uni.navigateTo({
					url: '../scan/scan'
				})
			},
			connectSocketInit() {
				let self = this
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				this.socketTask = uni.connectSocket({
					// 【非常重要】
					//必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099
					//【特别容易犯的错误】
					url: "ws://10.16.9.107:8880/endpoint/websocket/msgsvr/" + this.userId,
					success(data) {
						console.log("websocket连接成功");
					},
					fail() {
						self.reset()
					}
				});

				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				this.socketTask.onOpen((res) => {
					console.log("WebSocket连接正常打开中...！");
					this.is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常成功发送消息
					this.socketTask.send({
						data: "{\"toUserId\":\"" + uni.getStorageSync('lgnId') + "\"}",
						async success() {
							console.log("消息发送成功");
						},
					});
					// 注：只有连接正常打开中 ，才能正常收到消息
					this.socketTask.onMessage((res) => {
						console.log("收到服务器内容：" + res.data);
						this.msgSize = JSON.parse(res.data).size
					});
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				this.socketTask.onClose(() => {
					console.log("已经被关闭了")
				})
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				this.socketTask.close({
					success(res) {
						this.is_open_socket = false;
						console.log("关闭成功", res)
					},
					fail(err) {
						console.log("关闭失败", err)
					}
				})
			},
			// 防止长时间连接自动断开
			reset() {
				clearInterval(this.timeoutObj)
				this.start()
			},
			//重新连接
			start() {
				this.timeoutObj = setInterval(() => {
					this.connectSocketInit()
				}, 10000)
			},
			clickRequest() {
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,
					//同时返回一组数据【否则服务器会进去死循环崩溃】
					this.socketTask.send({
						data: "请求一次发送一次message",
						async success() {
							console.log("消息发送成功");
						},
					});
				}
			},
			//点击扫码按钮
			scanButtonClick() {
				this.scanShow = true
				setTimeout(() => {
					this.focus = true;
				}, 300);
			},
			// 扫码
			// scanNext(e){
			// 	// console.log('扫码了', e.target.value)
			// 	console.log(e.target.value)
			// 	this.scanId = e.target.value
			// 	this.scanShow = false
			// 	getApp().queryNo = e.target.value
			// 	setTimeout(()=>{
			// 		uni.navigateTo({
			// 			url:"/pages/production/opTask/index"
			// 		})
			// 	},300); 
			// 	this.scanId=''
			// },
			// chooseOneDeviceScan(){
			// 	console.log("123")
			// }
		},
		onShow() {
			currperm().then(res => {
				getApp().globalData.padGL = []
				this.codeList = ['0703_Andon', '0702_production', '0701_equipment', '0704_quality',
					'pad-saoMa1005'
				]
				res.data.forEach(item => {

					if (item.code == '07_padGL') {
						savePermission(item.sub);
						this.showList = this.codeList.map(item => {
							return hasPrivilege(item);
						})
						this.showList[4] = true;
						console.log('----', this.showList)
						// if (process.env.NODE_ENV !== 'development') {


						// }else{
						// 	this.showList = [true, true, true, true];
						// }
					}
				})
				if (getAppMenu().length == 0) {
					uni.showToast({
						title: "当前角色没有权限",
						icon: "none",
						duration: 2000
					})
				}
			})
			console.log("进入了主菜单2");
			lineWorkSpace().then(res => {
				if (res.err_code == 10000) {
					let instances = res.data.instances
					let sub = res.data.sub
					if (instances != null && instances != undefined && instances.length > 0) {
						uni.setStorageSync("workSpace", instances[0].typeName)
					} else if (sub != null && sub != undefined && sub.length > 0) {
						uni.setStorageSync("workSpace", sub[0].name)
					}
				}
			})
		},
		async onLoad(options) {
			upgradeApp.startUpgradeApp();
			// 进入这个页面的时候创建websocket连接【整个页面随时使用】
			this.connectSocketInit();
		}
	}
</script>

<style>
	.app-containerR {
		padding-top: 40rpx;
		justify-content: center;
		align-items: center;
	}

	.msg {
		position: absolute;
		color: #2979FF;
		right: 15rpx;
	}

	.msg-size {
		width: 20rpx;
		height: 20rpx;
		line-height: 20rpx;
		background-color: red;
		border-radius: 50%;
		text-align: center;
		position: absolute;
		right: 18rpx;
		top: 3rpx;
		z-index: 2;
	}

	.img-size {
		width: 20rpx;
		height: 20rpx;
		line-height: 20rpx;
		position: absolute;
		left: 18rpx;
		top: 3rpx;
		z-index: 2;
	}

	.app-containerR>.my-item {
		width: 150rpx;
		height: 240rpx;
		display: flex;
		margin-top: 15rpx;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.my-item>.group-title {
		font-size: 25rpx !important;
	}
</style>