<template>
	<view class="bom-item">
		<view class="top-item">
			<text class="name">{{ dataInfo.name || '--' }}</text>
			<!-- <text class="category">{{ dataInfo.category || '--' }}</text> -->
			<text class="icon">
				<u-popup v-model="showPopover" trigger="tap" placement="left" :actions="actions" @select="onSelect">
					<template #reference>
						<u-icon name="photograph" color="#3a62d7" size="20rpx" @tap.stop="takePhoto($event)" />
					</template>
				</u-popup>
			</text>
		</view>
		<view class="bottom-item">生产号：{{ dataInfo.productNo || '--' }}</view>
		<view class="bottom-item">流水码：{{ dataInfo.srialCode || '--' }}</view>
	</view>
</template>
<script>
	const actions = [{
			text: '拆解照片',
			id: 1
		},
		{
			text: '厂内生产照片',
			id: 2
		}
	]
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				actions: Object.freeze(actions),
				showPopover: false
			}
		},
		methods: {
			takePhoto() {
				this.showPopover = true;
			},
			onSelect(action) {
				this.$emit('takePhoto', this.dataInfo, action.id)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.bom-item {
		height: 196rpx;
		width: 100%;
		padding: 24rpx;
		border-bottom: 2rpx solid #7175752c;
		box-sizing: border-box;

		.top-item {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 68rpx;

			.name {
				font-size: 32rpx;
				font-weight: 400;
			}

			.category {
				margin-left: 16rpx;
				padding: 4rpx 12rpx;
				color: #485b70;
				font-size: 20rpx;
				border: 2rpx solid #75787985;
				border-radius: 20rpx;
				background-color: #6871742c;
			}

			.icon {
				margin-left: auto;
			}
		}

		.bottom-item {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 24rpx;
			color: #657685;
		}
	}
</style>