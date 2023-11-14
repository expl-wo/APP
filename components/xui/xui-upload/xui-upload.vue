<template>
	<view style="display: none;">
	</view>
</template>

<script>
import uploadHttp from '@/https/_public/upload.js';
import permission from '@/components/common/permission.js';
import { setToken, getToken } from '@/utils/auth.js';
export default {
	methods: {
		async uploadFile() {
			let result = await this.chooseImage();
			if (result.status !== this.$constants.status.success) {
				uni.showToast({
					icon: 'none',
					title: result.msg,
					duration: this.$constants.duration
				});
			}
			return result;
		},
		chooseImage: async function() {
			// #ifdef APP-PLUS
			// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
			let status = await this.checkPermission();
			if (status !== 1) {
				console.error('获取权限失败');
				return;
			}
			// #endif
			return new Promise((resolve, reject) => {
				uni.chooseImage({
					count: 1,
					sourceType: ['camera', 'album'],
					success: res => {
						let imageList = res.tempFilePaths;
						if (imageList.length > 0) {
							uploadHttp
								.upload({
									token: getToken(),
									filePath: imageList[0]
								})
								.then(response => {
									if (response.status === this.$constants.status.success) {
										return resolve(response);
									} else {
										return resolve({
											status: this.$constants.status.error,
											msg: response.msg
										});
									}
								});
						}
					},
					fail: err => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0) {
							this.checkPermission(err.code);
						}
						// #endif
						return resolve({
							status: this.$constants.status.error,
							msg: err.code
						});
					}
				});
			});
		},
		async checkPermission(typeName) {
			let status = await permission.requestAndroid(typeName === '拍照' ? 'android.permission.CAMERA' : 'android.permission.READ_EXTERNAL_STORAGE');
			if (status === null || status === 1) {
				status = 1;
			} else {
				uni.showModal({
					content: '没有开启权限',
					confirmText: '设置',
					success: function(res) {
						if (res.confirm) {
							permission.gotoAppSetting();
						}
					}
				});
			}
			return status;
		}
	}
};
</script>
