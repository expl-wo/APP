<template>
	<view></view>
</template>
<script>
	import permision from "@/components/common/permission.js"
	export default {
		props: {
			qrCodeType: {
				type: String,
				default: 'qrCode'
			},
		},
		methods: {
			async scan() {
				// #ifdef MP-WEIXIN
				uni.scanCode({
					scanType: [this.qrCodeType],
					success: (res) => {
						let code = res.result;
						if(typeof(code) === 'string'){
							code = code.trim();
						}
						this.$emit('scanResult', code);
					},
					fail: (err) => {
						// 需要注意的是小程序扫码不需要申请相机权限
					}
				});
				// #endif
				
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
				    return;
				}
				uni.scanCode({
					scanType: [this.qrCodeType],
					success: (res) => {
						this.$emit('scanResult', res.result);
					},
					fail: (err) => {
						// 需要注意的是小程序扫码不需要申请相机权限
					}
				});
				// #endif
			}
			// #ifdef APP-PLUS
			,
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			}
			// #endif
		}
	}
</script>

