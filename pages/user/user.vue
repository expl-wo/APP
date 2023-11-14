<template>
	<view class="content login-box layout-column">
		<view class="wp user-div layout-column cc animation-scale-up">
			<image src="../../static/img/user.png" class="userImg shadow"></image>
			<view class="title text-white2">{{userInfo.name}}</view>
			<view class="title text-white2">
				{{checkedJuese.roleDeptName}}
			</view>
			<view class="title text-white2" v-if="showVersion">
				当前版本：{{version}}
			</view>
		</view>
		<view class="wp app-containerR centerCls width-auto" style="margin-top: 20px;">
			<u-button type="primary" class="m-10" size="large" @tap="exit()">注销账号</u-button>
			<u-button type="primary" v-if="isApp && needBinding" class="m-10" size="large"
				@click="bindUserCard">工牌绑定</u-button>
			<u-button type="primary" v-if="isApp && needUnBinding" class="m-10" size="large"
				@click="unbindUserCard">工牌解绑</u-button>
			<u-button type="primary" class="m-10" size="large" @click="clickChangeJuese">切换角色</u-button>
			<u-button type="primary" class="m-10" v-if="showVersion" size="large" @click="checkUpdate">检查更新</u-button>
		</view>

		<!-- 刷卡弹窗 -->
		<view>
			<u-popup :show="show" mode="center" closeable border-radius="10">
				<view class="m-30">
					<input style="font-size: 25px;" type="text" value="请刷卡!" disabled="" />
				</view>
			</u-popup>
		</view>

		<!--角色弹窗-->
		<u-popup mode="bottom" :show="dialogFormVisible" @close="dialogFormVisible=false" closeOnClickOverlay>
			<view class="content">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view class="app-containerC wp table-zdy">
						<view class="th-group">
							<view class="th">角色名</view>
							<view class="th">操作</view>
						</view>
						<view class="td-group" v-for="x in roleList2" :key="x.id">
							<view class="td">{{x.roleDeptName}}</view>
							<view class="td">
								<button size="mini" type="primary" @click="qiehuanJuese(x)">切换角色</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<u-modal v-if="showScanModal" title="工牌绑定" width="500px" :show="showScanModal" :showConfirmButton="false"
			showCancelButton @cancel="showScanModal=false" closeOnClickOverlay>
			<xui-scan v-if="showScanModal" @scanResult="handleScanResult" label="请扫描工牌码"></xui-scan>
		</u-modal>
		<u-modal content="确认解绑？" :show="showUnBindingModal" width="500px" @confirm="unBinding" showCancelButton
			@cancel="showUnBindingModal=false"></u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		$confirm,
		getCardInfo
	} from '@/utils/common.js'
	import {
		chgcurrrole,
		bindingGpId,
		unbindingGpId,
		getBindingInfo
	} from '@/https/sys/permission.js'
	import {
		getCurrRole,
		setCurrRole,
		getToken,
		getUserInfo,
		getUserRoleList,
		removeToken
	} from '@/utils/auth.js'
	import {
		changeJuese,
		getQuanxian,
	} from '@/https/sys/quanxian.js'
	var NfcAdapter;
	import upgradeApp from '@/utils/upgrade.js'
	export default {
		data() {
			let showVersion = false,
				isApp = false;
			// #ifdef APP-PLUS
			showVersion = true;
			isApp = true;
			// #endif
			return {
				isApp,
				needBinding: false,
				needUnBinding: false,
				showVersion,
				version: '',
				flag: 0,
				roleList: [], //  全部的角色列表
				roleList2: [], //  除去当前角色的角色列表
				checkedJuese: {}, //当前的角色
				dialogFormVisible: false,
				//NFC
				UID: '',
				tip: '',
				show: false,
				_action: '',
				msgSize: '',
				wxInfo: {},
				userInfo: {},
				showScanModal: false,
				showUnBindingModal: false,
			}
		},
		onShow() {
			let roles = getUserRoleList();
			if (roles.length == 0) {
				uni.showToast({
					title: '当前无可用角色',
					icon: 'none',
					duration: 2000
				})
				return
			}
			this.roleList = roles;
			this.userInfo = getUserInfo();
			this.checkedJuese = getCurrRole();
			this.getVersion();
			//绑定时要工牌解绑还是绑定
			// #ifdef APP-PLUS
			this.getUserCardInfo();
			// #endif
		},
		onHide() {
			if (this.flag) {
				this.flag = 0
			}

		},
		methods: {
			getVersion() {
				// #ifdef APP-PLUS
				let self = this;
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
					self.version = 'V' + widgetInfo.version
				})
				// #endif
				// #ifndef APP-PLUS
				return ''
				// #endif
			},
			checkUpdate() {
				// #ifdef APP-PLUS
				upgradeApp.startUpgradeApp({
					type: 'manual'
				});
				// #endif
			},
			//注销
			exit() {
				$confirm('确定注销？').then(res => {
					removeToken()
					uni.reLaunch({
						url: '/pages/login/login',
					});
				})
			},
			getUserCardInfo() {
				//更新用户工牌信息
				getBindingInfo({}).then(resp => {
					if (resp.err_code === this.$constants.status.success2) {
						let userCode = resp.data;
						if (this.$constants.isNotEmpty(userCode)) {
							this.needBinding = false;
							this.needUnBinding = true;
						} else {
							this.needBinding = true;
							this.needUnBinding = false;
						}
					} else {
						this.$u.toast(resp.err_msg);
					}
				})
			},
			unbindUserCard() {
				this.showUnBindingModal = true;
			},
			bindUserCard() {
				this.showScanModal = true;
			},
			handleScanResult(scanCode) {
				if (getCardInfo(scanCode) === '') {
					uni.showToast({
						icon: 'none',
						title: '请扫描有效工牌码'
					})
					return;
				}
				this.showScanModal = false;
				//绑定
				uni.showLoading({
					title: "绑定中..."
				})
				let simpleScanCode = getCardInfo(scanCode.trim());
				bindingGpId({
						id: simpleScanCode
					}).then(res => {
						if (res.err_code === this.$constants.status.success2) {
							this.getUserCardInfo();
							this.$u.toast("绑定成功");
						} else {
							uni.showToast({
								icon: 'none',
								title: res.err_msg,
								duration: 3000
							})
						}
					})
					.finally(() => {
						uni.hideLoading();
					})
			},
			//点击切换角色  按钮触发事件
			clickChangeJuese() {
				this.dialogFormVisible = true
				this.roleList2 = this.roleList.filter(item => {
					return item.id != this.checkedJuese.id
				})
			},
			//切换角色
			qiehuanJuese(item) {
				this.checkedJuese = item
				setCurrRole(item);
				chgcurrrole({
					id: item.id
				}).then(res => {
					uni.showToast({
						title: '角色切换成功',
						icon: 'none'
					})
					this.dialogFormVisible = false
				})
			},
			unBinding() {
				this.showUnBindingModal = false;
				uni.showLoading({
					title: "解绑中..."
				})
				unbindingGpId({})
					.then(res => {
						if (res.err_code === this.$constants.status.success2) {
							this.getUserCardInfo();
							uni.showToast({
								icon: 'none',
								title: '解绑成功',
								duration: this.$constants.duration
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg,
								duration: this.$constants.duration
							})
						}
					})
					.finally(() => {
						uni.hideLoading();
					})
			},
			tap() {
				this.flag = 1
				this.show = true
			}
		}
	}
</script>

<style>
	.login-box {
		background-image: url('@/static/img/bg.jpg');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.container {
		padding: 20px;
		font-size: 14px;
	}

	.user-div {
		height: auto;
	}

	.msg {
		position: relative;
	}

	.msg .msg-size {
		position: absolute;
		text-align: center;
		line-height: 20rpx;
		top: -3rpx;
		right: -3rpx;
		background-color: red;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		z-index: 10;
	}

	.userImg {
		width: 100px;
		height: 100px;
		border-radius: 50px;
		margin: 70px 10px 10px;
		background-color: #fff;
	}

	.centerCls {
		justify-content: center;
	}
</style>