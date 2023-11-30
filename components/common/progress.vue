<template>
	<view class="progress-root">
		<view class="progress" :style="{ width: progressObj.percentage}">
			<text class="value">{{ progressObj.value }}/</text>
			<text class="total">{{ progressObj.total }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Progress',
		props: {
			// 进度条数据
			progressObj: {
				type: Object,
				default: () => ({
					value: 2,
					percentage: "60%",
					total: 19,
				}),
			}
		},
	};
</script>

<style lang="less" scoped>
	.progress-root {
		width: 100%;
		height: 18px;
		line-height: 18px;
		background-color: rgba(68, 81, 96, 0.1);
		border-radius: 16rpx;
		font-size: 14px;

		.progress {
			height: 100%;
			background-color: #3a62d7;
			// background-image: url("@/assets/imgs/staging/progress-bg.png");
			// background-size: 30rpx 30rpx;
			border-radius: 16rpx;
			text-align: right;
			margin-bottom: 12px;
		}

		.value {
			color: #fff;
		}

		.total {
			margin-right: 20rpx;
			color: rgba(255, 255, 255, 0.6);
		}
	}
</style>