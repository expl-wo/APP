<template>
	<view class="material-item">
		<view class="top">
			<view class="name">{{ dataInfo.materialTypeName || '--' }}</view>
			<view class="icon">
				<u-icon name="edit-pen" color="#3a62d7" size="36rpx" @click="editNum"></u-icon>
			</view>
		</view>
		<view>
			<view class="other-item full-row ellipsis">工序组织：{{ dataInfo.procedureLevel || '--' }}</view>
		</view>
		<view>
			<view class="other-item half-row ellipsis">材料类型：{{ dataInfo.materialType || '--' }}</view>
			<view class="other-item ellipsis">数量：{{ dataInfo.materialNum || '--' }}</view>
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
		},
		methods: {
			// 编辑数量
			editNum() {
				this.$emit('editNum', 'material', this.dataInfo);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.material-item {
		width: 100%;
		padding: 16rpx 20rpx;
		border-bottom: 2rpx solid #7175752c;
		.top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 40px;
			.name {
				flex: 1;
				font-size: 16px;
			}
			.icon {
				margin-left: auto;
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
	.half-row {
		width: 50%;
	}

	.full-row {
		width: 100%;
	}
</style>
