<template>
	<view class="progress-root">
		<view class="progress" :style="{ width: percentage || 0}">
			<text class="value">{{ percentage }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Progress',
		props: {
			// 进度条数据
			percentage: {
				type: String,
				default: '',
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

	}
</style>