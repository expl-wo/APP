<template>
	<view class="content login-box">
		<view class="title tc text-white text-df">湖南工程MES系统PAD端</view>
		<view class="wp login-box-border">
			<view class="login-box-cls shadow">
				<view class="imageView app-containerC cc">
					<image class="hp" src="../../static/img/logo.jpg"></image>
				</view>
				<u-form :model="form" ref="uForm">
					<u-form-item prop="lgnName">
						<u-input v-model="form.lgnName" placeholder="请输入用户名" prefixIcon="account"
							:suffixIcon="rightIcon" @suffix-icon-click="selectUser"
							suffixIconStyle="font-size: 22px;color: #3c9cff;"
							prefixIconStyle="font-size: 22px;color: #3c9cff;">
						</u-input>
					</u-form-item>
					<u-form-item prop="lgnPwd">
						<u-input :key="passwordType" :type="passwordType" confirmType="done" v-model="form.lgnPwd"
							placeholder="请输入密码" prefixIcon="lock" prefixIconStyle="font-size: 22px;color: #3c9cff"
							@confirm="formSubmit">
							<template slot="suffix">
								<u-icon slot="right" :color="passwordType === 'password' ? '#606266' : '#3c9cff'"
									name="eye" @click="handleChangePasswordType"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<view class="wp app-containerR cc">
						<u-button type="primary" class="m-20" @click="formSubmit">账号登录</u-button>
						<!-- <u-button type="primary" class="m-20" size="mini" @click="show = true">NFC登录</u-button> -->
						<u-button v-if="isApp" type="primary" class="m-20" @click="scanForPhone()">扫码登录</u-button>
					</view>
					<view>
						<xui-scan v-show="false" v-if="showScan" @scanResult="handleScanResult" label="扫工牌码登录"></xui-scan>
					</view>
					<!-- 记住密码 -->
					<view class="remember-psw">
						<checkbox-group>
							<label>
								<checkbox value="psw" :checked='rememberPsw' @tap="rememberPsw =! rememberPsw"
									color="#09CC86" />记住账号密码
							</label>
						</checkbox-group>
					</view>
				</u-form>
			</view>
		</view>
		<view class="foot"  v-if="isApp">
			<text>技术支持: 流程与数字化管理部 |</text><text v-if="isApp" @click="showFormalDialog=true">{{formalDesc}}</text><text
				style="margin-left: 5rpx;">版本号:{{version}}</text>
		</view>
		<view class="foot"  v-else>
			<text>技术支持: 流程与数字化管理部</text>
		</view>

		<!-- 刷卡弹窗 -->
		<view>
			<u-popup v-model="show" mode="center" closeable border-radius="10">
				<view class="m-30">
					<input style="font-size: 25px;" type="text" value="请刷卡!" disabled="" />
				</view>
			</u-popup>
		</view>
		<u-picker :show="showFormalDialog" itemHeight="30" :columns="list" keyName="label"
			@confirm="handleFomralConfirm" @cancel="showFormalDialog=false"></u-picker>
		<u-picker :show="selectUserShow" itemHeight="30" :columns="lgnInfoList" keyName="lgnName"
			@confirm="selectUserConfirm" @cancel="selectUserShow=false"></u-picker>
	</view>
</template>

<script>
	import {
		getToken,
		getFormalData,
		setFormalData
	} from '@/utils/auth.js'
	import {
		getQuanxian
	} from '@/https/sys/quanxian.js'
	import {
		mapState
	} from 'vuex'
	import {
		login,
		loginScanCode
	} from '@/https/sys/login'
	import {
		myInfo
	} from '@/https/sys/permission'
	import {
		isNotEmptyArr
	} from '@/utils/util-function.js'
	var NfcAdapter;
	export default {
		computed: {
			...mapState(['lgn']),
			formalDesc() {
				if (this.formal === 'c') {
					return '测试版'
				} else if (this.formal === 'z') {
					return '正式版'
				} else {
					return ''
				}
			}
		},
		data() {
			let isApp = false;
			// #ifdef APP-PLUS
			isApp = true;
			// #endif
			return {
				isApp,
				passwordType: 'password',
				formal: getFormalData(),
				showFormalDialog: false,
				list: [
					[{
						label: '正式版',
						value: 'z'
					}, {
						label: '测试版',
						value: 'c'
					}],
				],
				form: {
					lgnName: '',
					lgnPwd: ''
				},
				rememberPsw: true,
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				//NFC
				UID: '',
				tip: '',
				show: false,
				version: 0,
				//扫码登陆
				scanLoginModel: {
					workcardCode: '',
					type: '0',
					userName: '',
				},
				showScan: false,
				lgnInfoList: null,
				rightIcon: '',
				selectUserShow: false,
				userInfoList: []
			}
		},
		// computed:,
		created() {
			let userInfoList = [];
			let userData = uni.getStorageSync('userInfoList');
			if (userData) userInfoList = JSON.parse(userData)
			this.userInfoList = userInfoList;
			if (userInfoList && userInfoList.length > 0) {
				this.lgnInfoList = [userInfoList]
			} else {
				this.lgnInfoList = [];
			}
			if (userInfoList.length >= 1) this.rightIcon = 'arrow-down-fill'
		},
		onReady() {
			if (getToken()) {
				uni.reLaunch({
					url: '/pages/main/main',
				});
			}
		},
		onLoad() {

		},
		//NFC
		onShow() {
			this.showScan = true;
			// #ifdef APP-PLUS
			this.NFCInit();
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				this.version = widgetInfo.version
			})
			// #endif
		},
		onHide() {
			this.showScan = false;
			this.NFCReadUID();
		},
		mounted: function() {
			let that = this;
			//页面加载完成，获取本地存储的用户名及密码
			if (this.userInfoList.length > 0) {
				let user = this.userInfoList[0]
				that.form.lgnName = user.lgnName;
				that.form.lgnPwd = user.lgnPwd;
			} else {
				that.form.lgnName = "";
				that.form.lgnPwd = "";
				if (process.env.NODE_ENV === 'development') {
					that.form.lgnName = "539740";
					that.form.lgnPwd = "tbea539740";
				}
			}
		},
		watch: {
			selectUserShow: function(newVal, oldVal) {
				this.changeIcon()
			}
		},
		methods: {
			handleFomralConfirm(e) {
				this.formal = e.value[0].value;
				setFormalData(this.formal);
				this.showFormalDialog = false;
			},
			//切换密码输入框展示类型
			handleChangePasswordType() {
				this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
			},
			//登录
			formSubmit: function() {
				login({
					username: this.form.lgnName,
					password: this.form.lgnPwd,
					type: 1
				}).then(res => {
					if (res.err_code !== this.$constants.status.success2) {
						uni.showToast({
							icon: 'none',
							title: res.err_msg,
							duration: this.$constants.duration
						})
						return;
					}
					let respData = res.data;
					if (!isNotEmptyArr(respData.roles)) {
						uni.showToast({
							icon: 'none',
							title: '用户未授予任何角色，请联系管理员',
							duration: this.$constants.duration
						})
						return;
					}
					uni.reLaunch({
						url: '/pages/main/main',
					});
					uni.setStorageSync('lgnId', respData.userInfo.id);
					uni.setStorageSync('lgnName', this.form.lgnName);
					//登录成功将用户名密码存储到用户本地
					if (this.rememberPsw) { //用户勾选“记住密码”
						uni.setStorageSync('lgnPwd', this.form.lgnPwd);
						let user = {
							'lgnName': this.form.lgnName,
							'lgnPwd': this.form.lgnPwd
						}
						let userInfoList = [];
						let userData = uni.getStorageSync('userInfoList');
						if (userData) userInfoList = JSON.parse(userData)
						userInfoList = userInfoList.filter(item => item.lgnName != user.lgnName)
						userInfoList.unshift(user)
						uni.setStorageSync('userInfoList', JSON.stringify(userInfoList));
					} else { //用户没有勾选“记住密码”
						//如果userInfoList中存在就删除
						let user = {
							'lgnName': this.form.lgnName,
							'lgnPwd': this.form.lgnPwd
						}
						let userInfoList = [];
						let userData = uni.getStorageSync('userInfoList');
						if (userData) userInfoList = JSON.parse(userData)
						userInfoList = userInfoList.filter(item => item.lgnName != user.lgnName)
						uni.setStorageSync('userInfoList', JSON.stringify(userInfoList));
						uni.removeStorageSync('lgnName');
						uni.removeStorageSync('lgnPwd');
						this.form.lgnName = "";
						this.form.lgnPwd = "";
					}
				})
			},
			//NFC登录接口
			nfcLogin() {
				this.show = false
				login({
					type: 1,
					keyNum: this.UID,
					lgnType: 1
				}).then(res => {
					uni.reLaunch({
						url: '/pages/main/main',
					});
				})
			},

			//NFC功能
			NFCInit() {
				// #ifdef APP-PLUS
				try {
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass('android.content.Intent');
					var Activity = plus.android.importClass('android.app.Activity');
					var PendingIntent = plus.android.importClass('android.app.PendingIntent');
					var IntentFilter = plus.android.importClass('android.content.IntentFilter');
					NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
					var _nfcAdapter = NfcAdapter.getDefaultAdapter(main)

					var ndef = new IntentFilter(
						"android.nfc.action.NDEF_DISCOVERED"); //NfcAdapter.ACTION_NDEF_DISCOVERED  
					var tag = new IntentFilter("android.nfc.action.TAG_DISCOVERED"); //NfcAdapter.ACTION_TECH_DISCOVERED  
					var tech = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
					var intentFiltersArray = [ndef, tag, tech];

					var techListsArray = [
						["android.nfc.tech.Ndef"],
						["android.nfc.tech.IsoDep"],
						["android.nfc.tech.NfcA"],
						["android.nfc.tech.NfcB"],
						["android.nfc.tech.NfcF"],
						["android.nfc.tech.Nfcf"],
						["android.nfc.tech.NfcV"],
						["android.nfc.tech.NdefFormatable"],
						["android.nfc.tech.MifareClassi"],
						["android.nfc.tech.MifareUltralight"]
					];

					var _intent = new Intent(main, main.getClass());
					_intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

					var pendingIntent = PendingIntent.getActivity(main, 0, _intent, 0);

					if (_nfcAdapter == null) {
						this.tip = '本设备不支持NFC!';
					} else if (_nfcAdapter.isEnabled() == false) {
						this.tip = 'NFC功能未打开!';
					} else {
						this.tip = 'NFC正常';
						_nfcAdapter.enableForegroundDispatch(main, pendingIntent, IntentFilter, techListsArray);
					}
				} catch (e) {

				}
				// #endif
			},

			NFCReadUID() {
				// #ifdef APP-PLUS
				var main = plus.android.runtimeMainActivity();
				var _intent = main.getIntent();
				var _action = _intent.getAction();

				if (NfcAdapter.ACTION_NDEF_DISCOVERED == _action || NfcAdapter.ACTION_TAG_DISCOVERED == _action ||
					NfcAdapter.ACTION_TECH_DISCOVERED ==
					_action) {
					var Tag = plus.android.importClass('android.nfc.Tag');
					var tagFromIntent = _intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
					var uid = _intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
					this.UID = this.Bytes2HexString(uid);
					if (this.UID) {
						this.nfcLogin()
					}
				}
				// #endif
			},
			//将byte[] 转为Hex，  
			Bytes2HexString(arrBytes) {
				var str = "";
				for (var i = 0; i < arrBytes.length; i++) {
					var tmp;
					var num = arrBytes[i];
					if (num < 0) {
						//Java中数值是以补码的形式存在的，应用程序展示的十进制是补码对应真值。补码的存在主要为了简化计算机底层的运算，将减法运算直接当加法来做  
						tmp = (255 + num + 1).toString(16);
					} else {
						tmp = num.toString(16);
					}
					if (tmp.length == 1) {
						tmp = "0" + tmp;
					}
					str += tmp;
				}
				return str;
			},

			//清空，不用了
			formReset: function() {
				this.form = {
					lgnName: '',
					lgnPwd: ''
				}
			},
			//以下为扫码登陆
			handleScanResult(result) {
				this.loginScanCode(result);
			},
			handleStartScan() {
				this.$refs.scanCodeRef && this.$refs.scanCodeRef.scan();
			},
			//扫码登录
			scanLogin() {
				login({
					type: 3,
					keyNum: this.scanLoginModel.workcardCode,
					lgnType: 1
				}).then(res => {
					uni.reLaunch({
						url: '/pages/main/main',
					});
				}).finally(() => {
					uni.hideLoading();
				})
			},
			scanForPhone() {
				var that = this
				uni.scanCode({
					onlyFromCamera: true,
					success: resScanCode => {
						this.loginScanCode(resScanCode.result)
					}
				})
			},
			loginScanCode(scanResult){
				loginScanCode({
					scanCode: scanResult,
				}).then(res => {
					if (res.err_code !== this.$constants.status.success2) {
						uni.showToast({
							icon: 'none',
							title: res.err_msg,
							duration: this.$constants.duration
						})
						return;
					}
					let respData = res.data;
					if (!isNotEmptyArr(respData.roles)) {
						uni.showToast({
							icon: 'none',
							title: '用户未授予任何角色，请联系管理员',
							duration: this.$constants.duration
						})
						return;
					}
					uni.setStorageSync('lgnId', respData.userInfo.id);
					uni.reLaunch({
						url: '/pages/main/main',
					});
				})
			},
			changeIcon() {
				if (this.selectUserShow) this.rightIcon = 'arrow-up-fill'
				else this.rightIcon = 'arrow-down-fill'
			},
			selectUser() {
				this.selectUserShow = !this.selectUserShow
				this.changeIcon()
			},
			selectUserConfirm(e) {
				this.selectUser()
				this.form.lgnName = e.value[0].lgnName;
				this.form.lgnPwd = e.value[0].lgnPwd;
			}
		},

		
	}
</script>

<style>
	.title {
		padding: 40px 0 20px 0;
	}

	.login-box {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		background-image: url('@/static/img/bg.jpg');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.login-box .login-box-border {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		/* padding-bottom: 8rem; */
	}

	.foot {
		color: #1890ff;
		padding-top: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		/* padding-bottom: 8rem; */
	}

	.login-box-cls {
		background: #fff;
		height: auto;
		padding: 10px 30px;
		width: 550px;
		border-radius: 10px;
	}

	.icon_cls {
		margin-right: 10px;
	}

	.image-cls {
		width: 25px;
		height: 25px;
	}

	.imageView {
		width: 100%;
		height: 80px;
	}

	.imageView img {
		width: 80%;
	}
</style>

<style scoped lang="scss">
	.login-box {
		.u-field {
			padding: 4rpx
		}
	}

	/deep/ .u-select__body__picker-view__item {
		font-size: 25px;
	}
</style>