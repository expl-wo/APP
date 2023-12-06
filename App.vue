<script>
	export default {
		globalData: {//手持端是否是pda Device
			isPdaDevice: false,
			andonData: {},
			padGL: [],
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			// plus.screen.lockOrientation('landscape-primary');
			// #endif
		},
		onShow: function() {
			const {brand } = uni.getSystemInfoSync();	
			if (brand && brand.toLocaleUpperCase().indexOf('SEUIC') >= 0) {
				this.globalData.isPdaDevice = true;
			}
		},
	};
</script>

<style lang="scss">
	@import 'uview-ui/index.scss';
	@import "@/static/css/app.css";
	@import '@/assets/css/index.scss';
	@import '@/assets/css/util.scss';
	@import '@/assets/css/common.scss';
	@import '@/assets/css/xui.scss';

	/*每个页面公共css */
	page {
		height: 100%;
		width: 100%;
		display: flex;
		font-size: 16px;
	}

	.header {
		border-bottom: 5px solid #aaa;
		padding-left: 15px;
	}

	button {
		display: inline-block;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
		padding: 10rpx 0px;
	}

	.app-containerR>.my-item {
		width: 31%;
		height: 110rpx;
		margin-top: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.my-item>.group-title {
		font-size: 20rpx !important;
	}

	uni-toast .uni-toast__content {
		font-size: 50rpx;
	}
	.u-loadmore__content__text {
		line-height: 16px !important;
	}

	.u-loading-icon__spinner--spinner {
		width: 15px !important;
		height: 15px !important;
	}
</style>