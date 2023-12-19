<template>
	<view class="item-wapper">
		<view class="top">
			<view>
				<text>{{ dataInfo.equipmentModel || '--' }}</text>
				<text class="status ml12"
					:class="[dataInfo.status ? 'busy' : 'free']">{{ dataInfo.status ? '繁忙' : '空闲' }}</text>
			</view>
		</view>
		<view>
			<view class="other-item half-row ellipsis">设备编号：{{ dataInfo.equipmentModel || '--' }}</view>
			<view class="other-item half-row ellipsis">设备类别：{{ dataInfo.equipmentType || '--' }}</view>
		</view>
		<view>
			<view class="other-item half-row ellipsis">领用人：{{ dataInfo.receivePerson || '--' }}</view>
			<view class="other-item half-row ellipsis">领用时间：{{ dataInfo.receiveDate || '--' }}</view>
		</view>
		<view>
			<view class="other-item full-row ellipsis">工序组织：{{ dataInfo.organization || '--' }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataInfo: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.item-wapper {
		width: 100%;
		padding: 16rpx 20rpx;
		border-bottom: 2rpx solid #7175752c;

		.top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 40px;
			line-height: 40px;

			.status {
				padding: 2px 8px;
				border-radius: 2px;
			}
		}

		.other-item {
			display: inline-block;
			height: 20px;
			line-height: 20px;
			font-size: 14px;
			color: #657685;
		}

	}

	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ml12 {
		margin-left: 12rpx;
	}

	.half-row {
		width: 50%;
	}

	.full-row {
		width: 100%;
	}

	.busy {
		background-color: #ffbdac;
		color: #ff0000;
	}

	.free {
		background-color: #d2fbd1;
		color: #007e04;
	}
</style>